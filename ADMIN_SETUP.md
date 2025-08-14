# Configuration de l'accès administrateur

## Étape 1: Obtenir votre ID utilisateur

1. Connectez-vous à l'application via votre provider OAuth (Google/GitHub)
2. Allez sur `/settings` et regardez en bas de la page "Informations du compte"
3. Copiez votre "ID utilisateur" qui ressemble à : `user_123456789abcdef`

## Étape 2: Configurer l'environnement

1. Ouvrez le fichier `.env.local`
2. Remplacez la ligne :
   ```env
   ADMIN_USER_ID="admin_user_id_here"
   ```
   
   Par votre vrai ID :
   ```env
   ADMIN_USER_ID="votre_user_id_ici"
   ```

## Étape 3: Redémarrer l'application

```bash
pnpm run dev
```

## Vérification

Une fois configuré, vous devriez :

1. ✅ Pouvoir accéder à `/admin/dashboard` 
2. ✅ Voir le header rouge "Administration" 
3. ✅ Avoir accès aux métriques et statistiques complètes
4. ✅ Pouvoir utiliser les APIs `/api/admin/*`

## Sécurité

- ⚠️ **IMPORTANT** : L'ID admin n'est visible que dans le fichier `.env.local` 
- 🔒 Ce fichier ne doit **jamais** être committé dans git
- 👤 Seul l'utilisateur avec cet ID exact peut accéder aux fonctions admin
- 🛡️ Tous les autres utilisateurs sont automatiquement redirigés vers `/dashboard`

## Structure des accès

### Utilisateur normal
- ✅ Dashboard personnel
- ✅ Génération de rapports  
- ✅ Gestion des crédits
- ✅ Settings personnels
- ❌ Accès admin

### Utilisateur admin (vous)
- ✅ Tout ce que peut faire un utilisateur normal
- ✅ Dashboard administrateur (`/admin/dashboard`)
- ✅ Statistiques globales
- ✅ APIs administrateur
- ✅ Vue d'ensemble de tous les utilisateurs

## En cas de problème

Si vous ne pouvez pas accéder à l'admin :

1. Vérifiez que votre ID est correct dans `.env.local`
2. Redémarrez le serveur (`pnpm run dev`)
3. Vérifiez les logs de la console pour les erreurs
4. Assurez-vous d'être connecté avec le bon compte