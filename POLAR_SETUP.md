# Configuration Polar pour FinAnalytics

## Problème actuel

L'intégration Polar est configurée mais utilise des ID de produits factices. Vous devez créer de vrais produits dans votre dashboard Polar et mettre à jour la configuration.

## Étapes de configuration

### 1. Créer des produits dans Polar

1. Connectez-vous à votre [dashboard Polar](https://polar.sh/dashboard)
2. Créez les produits suivants :

#### Abonnements
- **Plan Starter** : Abonnement mensuel avec accès API
- **Plan Professional** : Abonnement mensuel avec fonctionnalités avancées
- **Plan Enterprise** : Abonnement mensuel avec tout inclus

#### Packs de crédits
- **100 crédits** : Pack de 100 crédits (€69)
- **500 crédits** : Pack de 500 crédits (€299)
- **2000 crédits** : Pack de 2000 crédits (€1099)

### 2. Obtenir les ID de produits

Une fois les produits créés, vous pouvez obtenir leurs UUID via :

```bash
curl -H "Authorization: Bearer YOUR_POLAR_ACCESS_TOKEN" \
     https://api.polar.sh/v1/products
```

Ou utilisez l'endpoint debug de l'application :
```
GET /api/debug/polar-products
```

### 3. Mettre à jour la configuration

Dans `src/lib/polar.ts`, remplacez les ID factices par les vrais UUID :

```typescript
export const POLAR_PRODUCTS = {
  // Remplacez par les vrais UUID de vos produits Polar
  STARTER: "uuid-de-votre-plan-starter",
  PROFESSIONAL: "uuid-de-votre-plan-professional", 
  ENTERPRISE: "uuid-de-votre-plan-enterprise",
  
  CREDITS_100: "uuid-de-votre-pack-100-credits",
  CREDITS_500: "uuid-de-votre-pack-500-credits",
  CREDITS_2000: "uuid-de-votre-pack-2000-credits",
} as const;
```

### 4. Configurer les webhooks

Configurez les webhooks Polar pour pointer vers :
```
https://votre-domaine.com/api/webhooks/polar
```

Événements à écouter :
- `subscription.created`
- `subscription.updated` 
- `subscription.canceled`
- `order.created`

### 5. Variables d'environnement

Assurez-vous que ces variables sont définies :

```env
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_SUCCESS_URL=https://votre-domaine.com/plan/success
```

## Test de l'intégration

Une fois configuré, testez l'achat de crédits :

1. Allez sur `/credits/buy`
2. Sélectionnez un pack de crédits
3. Cliquez sur "Acheter"
4. Vérifiez que la redirection vers Polar fonctionne

## Débogage

- Utilisez `/api/debug/polar-products` pour voir vos produits
- Vérifiez les logs de l'application pour les erreurs Polar
- Consultez les webhooks dans votre dashboard Polar