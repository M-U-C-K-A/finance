# AGENTS.MD - Documentation Technique HedgeFound

## 1. Architecture Globale
### Structure des Dossiers
```
app/
├── (app)/          # Zone authentifiée (dashboard)
│   ├── api/        # Routes API internes
│   └── dashboard/  # Pages du dashboard
└── (home)/         # Zone publique (landing/auth)
src/
├── components/     # Composants organisés par fonction
├── lib/            # Utilitaires (auth, prisma)
└── hooks/          # Hooks personnalisés
```

### Services Externes
- **Auth Providers** : Google, Apple (via NextAuth)
- **Futurs Intégrations** : Stripe (paiements), Cron jobs (scripts Python)

## 2. Authentification
### Flow d'Authentification
- **Deux méthodes** :
  1. Page dédiée (`/signin`) sans layout
  2. Modal via sidebar (dans l'espace dashboard)
- **Gestion des Sessions** : JWT avec NextAuth
- **Problème Connu** : Conflit de redirection après logout (à investiguer)

### Modèle Utilisateur (Prisma)
```prisma
// Extensions possibles (à confirmer) :
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  pdfs          Pdf[]     // Relation future aux PDF générés
}
```

## 3. Dashboard
### Composants Clés (shadcn)
- **Structure** :
  - `sidebar.tsx` (navigation principale)
  - `data-table` (liste des PDF)
  - `card` (stats résumées)
- **Thème** : Light/Dark mode implémenté via `ThemeProvider`
- **Squelettes** : Loading states (`dashboardSkeleton.tsx`)

## 4. Fonctionnalités Futures
### Priorités
1. **Correction Auth** : 
   - Résolution du bug de redirection post-logout
   - Gestion propre des sessions multiples
2. **Gestion des PDF** :
   - Intégration des scripts Python (cron)
   - Stockage des résultats (S3 ou dossier local)
3. **Monétisation** :
   - Intégration Stripe (abonnements)
   - Limitation des fonctionnalités par plan

## 5. Sécurité
### Mesures Actives
- **Authentification** : 
  - NextAuth avec chiffrement JWT
  - Protection des routes via middleware
- **Fichiers** : 
  - Accès restreint aux PDF utilisateur

### À Prévoir
- Audit de sécurité après intégration Stripe
- Politique de backup des données (Prisma)

## 6. Roadmap
### Court Terme (1-2 semaines)
- [x] Intégration Google/Apple Auth
- [ ] Correction flow de logout
- [ ] Page Settings (profil, préférences)

### Moyen Terme
- [ ] Système de génération PDF
- [ ] Intégration Stripe
- [ ] Dashboard admin (suivi utilisateurs)

## Schéma Global : Cycle de Connexion/Déconnexion
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Middleware
    participant NextAuth
    participant Prisma
    participant Provider(Apple/Google)

    User->>Frontend: 1. Click "Sign in with Apple"
    Frontend->>Provider: 2. Redirection vers Apple
    Provider-->>Frontend: 3. Callback avec code
    Frontend->>NextAuth: 4. Échange code/token
    NextAuth->>Prisma: 5. Upsert User (via adapter)
    Prisma-->>NextAuth: 6. User data
    NextAuth->>Frontend: 7. JWT + Session cookie
    Frontend->>Middleware: 8. Requête dashboard (cookie)
    Middleware->>Prisma: 9. Vérif session (optional)
    Prisma-->>Middleware: 10. Session valide
    Middleware->>Frontend: 11. Accès autorisé

    loop Usage
        User->>Frontend: 12. Demande rapport PDF
        Frontend->>Middleware: 13. Vérif rôle/abonnement
        Middleware-->>Frontend: 14. Autorisation OK
        Frontend->>API: 15. Génération PDF
    end

    User->>Frontend: 16. Click "Logout"
    Frontend->>NextAuth: 17. Invalide session
    NextAuth->>Prisma: 18. Supprime session
    Prisma-->>NextAuth: 19. Confirmation
    NextAuth->>Frontend: 20. Redirection /login

    User->>Frontend: 21. Login email (SSO)
    Frontend->>NextAuth: 22. Credentials flow
    NextAuth->>Prisma: 23. Find user by email
    alt Email vérifié
        Prisma-->>NextAuth: 24. User exists
        NextAuth->>Frontend: 25. Nouvelle session
    else Nouvel email
        NextAuth->>Prisma: 26. Crée nouveau user
    end
```

## Schéma Séquence Rapport PDF
```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Middleware
    participant API
    participant Prisma
    participant Worker(Python)

    User->>UI: 1. Soumet formulaire rapport
    UI->>Middleware: 2. POST /api/reports (avec JWT)
    Middleware->>Prisma: 3. Vérifie limite quota (user.plan)
    alt Quota OK
        Prisma-->>Middleware: 4. Confirmation
        Middleware->>API: 5. Passe la requête
        API->>Prisma: 6. Crée entrée ReportRequest
        Prisma-->>API: 7. ID report
        API->>Worker: 8. Push tâche (ID + params)
        Worker->>Prisma: 9. Met à jour status (PENDING→PROCESSING)
        Worker->>Prisma: 10. Finalise (status: DONE, storagePath)
        UI->>UI: 11. Polling /api/reports/{id}
    else Quota dépassé
        Prisma-->>Middleware: 4. Erreur
        Middleware->>UI: 5. 402 Payment Required
    end
```
