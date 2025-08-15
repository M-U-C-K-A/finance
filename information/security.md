# Sécurité - FinAnalytics

## 🛡️ Architecture de Sécurité

FinAnalytics implémente une stratégie de sécurité multi-couches pour protéger les données utilisateurs et garantir la conformité aux standards industriels.

### 🔐 Authentification & Autorisation

#### Système d'Authentification

- **Better Auth**: Système d'authentification moderne et sécurisé
- **Multi-providers**: Google, GitHub, Email/Password
- **Session Management**: JWT avec rotation automatique
- **2FA**: Authentification à deux facteurs (TOTP)

```typescript
// Configuration sécurisée
{
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24, // Refresh quotidien
  },
  jwt: {
    expiresIn: "30d",
    algorithm: "HS256"
  }
}
```

#### Gestion des Rôles

```typescript
enum UserRole {
  USER     // Utilisateur standard
  ADMIN    // Administrateur système
}

// Middleware de vérification des rôles
const requireAdmin = (handler) => async (req, res) => {
  const user = await getUser(req);
  if (user.role !== 'ADMIN') {
    throw new UnauthorizedError();
  }
  return handler(req, res);
};
```

### 🔑 Gestion des Clés API

#### Génération Sécurisée

```typescript
// Format: fina_live_32_caractères_aléatoires
const generateApiKey = () => {
  const prefix = process.env.NODE_ENV === 'production' ? 'fina_live_' : 'fina_test_';
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return prefix + randomBytes;
};

// Stockage hashé
const hashedKey = await bcrypt.hash(apiKey, 12);
```

#### Rate Limiting par Clé

```typescript
// Limites par plan
const rateLimits = {
  FREE: { requests: 100, window: '1h' },
  STARTER: { requests: 1000, window: '1h' },
  PROFESSIONAL: { requests: 5000, window: '1h' },
  ENTERPRISE: { requests: 50000, window: '1h' }
};
```

### 🌐 Sécurité Réseau

#### Headers de Sécurité

```typescript
const securityHeaders = {
  // HTTPS forcé
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Protection XSS
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // CSP stricte
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.finanalytics.app",
    "frame-ancestors 'none'"
  ].join('; '),
  
  // Permissions restrictives
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()'
  ].join(', ')
};
```

#### Protection DDoS

```typescript
// Rate limiting global
export const globalRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1m"),
  analytics: true,
});

// Protection par endpoint
const endpointLimits = {
  '/api/reports/generate': { limit: 10, window: '1m' },
  '/api/auth/signin': { limit: 5, window: '15m' },
  '/api/user/password-reset': { limit: 3, window: '1h' }
};
```

### 💾 Sécurité des Données

#### Chiffrement

```typescript
// Données sensibles chiffrées en base
const encryptSensitiveData = (data: string) => {
  const cipher = crypto.createCipher('aes-256-gcm', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Chiffrement au niveau colonne (Prisma)
model User {
  id       String @id
  email    String
  // Données sensibles chiffrées
  @@map("users")
}
```

#### Protection des Mots de Passe

```typescript
// Hashage sécurisé avec bcrypt
const hashPassword = async (password: string) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Politique de mot de passe
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90 jours
};
```

#### Anonymisation des Logs

```typescript
// Sanitization des logs
const sanitizeForLogs = (obj: any) => {
  const sensitiveFields = ['password', 'token', 'apiKey', 'email'];
  return Object.keys(obj).reduce((acc, key) => {
    if (sensitiveFields.includes(key)) {
      acc[key] = '[REDACTED]';
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
```

### 🔍 Audit et Monitoring

#### Logs d'Audit

```typescript
// Événements audités
interface AuditEvent {
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'API_CALL' | 'REPORT_GENERATED' | 'PAYMENT';
  resource?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Stockage des logs d'audit
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'audit.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
```

#### Détection d'Anomalies

```typescript
// Détection de tentatives de brute force
const detectBruteForce = async (email: string, ip: string) => {
  const attempts = await redis.get(`login_attempts:${ip}`);
  if (attempts && parseInt(attempts) > 5) {
    // Bloquer l'IP temporairement
    await redis.setex(`blocked_ip:${ip}`, 3600, 'blocked');
    
    // Alerter l'équipe sécurité
    await sendSecurityAlert({
      type: 'BRUTE_FORCE',
      email,
      ip,
      attempts
    });
  }
};
```

### 💳 Sécurité des Paiements

#### Intégration Polar

```typescript
// Vérification webhook signature
const verifyWebhookSignature = (payload: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.POLAR_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

// Gestion sécurisée des tokens
const polarConfig = {
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
};
```

#### Protection contre la Fraude

```typescript
// Vérifications anti-fraude
const fraudChecks = {
  // Limite de génération de rapports
  rateLimitByUser: async (userId: string) => {
    const count = await redis.get(`reports:${userId}:today`);
    return parseInt(count || '0') < 50;
  },
  
  // Détection de patterns suspects
  detectSuspiciousActivity: async (userId: string, action: string) => {
    const recentActions = await getRecentActions(userId);
    return analyzeSuspiciousPattern(recentActions, action);
  }
};
```

### 🔒 Conformité et Standards

#### GDPR/RGPD

```typescript
// Gestion du consentement
interface ConsentRecord {
  userId: string;
  consentType: 'ANALYTICS' | 'MARKETING' | 'FUNCTIONAL';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
}

// Droit à l'oubli
const deleteUserData = async (userId: string) => {
  await Promise.all([
    prisma.user.delete({ where: { id: userId } }),
    prisma.reports.deleteMany({ where: { userId } }),
    prisma.auditLogs.deleteMany({ where: { userId } }),
    deleteUserFiles(userId)
  ]);
};
```

#### SOC 2 Type II

- **Contrôles d'accès**: Vérification d'identité multi-facteurs
- **Chiffrement**: AES-256 pour les données au repos, TLS 1.3 en transit
- **Monitoring**: Logs complets avec rétention de 2 ans
- **Sauvegardes**: Chiffrées et testées mensuellement

### 🚨 Plan de Réponse aux Incidents

#### Processus d'Escalation

```typescript
enum SecurityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

const incidentResponse = {
  [SecurityLevel.CRITICAL]: {
    notifyWithin: '15 minutes',
    respondWithin: '1 hour',
    contacts: ['security@finanalytics.app', 'ceo@finanalytics.app']
  },
  [SecurityLevel.HIGH]: {
    notifyWithin: '1 hour',
    respondWithin: '4 hours',
    contacts: ['security@finanalytics.app']
  }
};
```

#### Procédures d'Urgence

1. **Détection**: Monitoring automatisé + alertes
2. **Confinement**: Isolation des systèmes compromis
3. **Investigation**: Analyse forensique
4. **Récupération**: Restauration sécurisée
5. **Communication**: Notification utilisateurs si nécessaire

### 🔧 Outils de Sécurité

#### Scanning et Tests

```bash
# Tests de sécurité automatisés
npm run security:scan
npm run security:dependencies
npm run security:secrets

# Audit de code
npx semgrep --config=security .
npx eslint-plugin-security .
```

#### Monitoring Continu

- **Sentry**: Monitoring erreurs et performances
- **LogRocket**: Session replay pour analyse post-incident
- **Uptime Robot**: Surveillance disponibilité
- **Qualys SSL**: Vérification configuration SSL

### 📊 Métriques de Sécurité

#### KPIs Sécurisé

- **MTTR**: Temps moyen de résolution < 4h
- **Incidents**: < 1 incident critique/trimestre
- **Compliance**: 100% aux audits internes
- **Vulnérabilités**: Patchées sous 48h (critiques)

#### Rapports de Sécurité

- Audit mensuel des accès
- Revue trimestrielle des permissions
- Évaluation annuelle des risques
- Tests de pénétration semestriels

Cette architecture de sécurité garantit la protection des données financières sensibles et maintient la confiance des utilisateurs dans la plateforme FinAnalytics.