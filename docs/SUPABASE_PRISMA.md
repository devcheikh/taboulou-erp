# Configuration Supabase + Prisma

Ce projet utilise **Supabase** comme base de données PostgreSQL et **Prisma** comme ORM.

## 📦 Packages installés

- `@prisma/client` - Client Prisma pour les requêtes de base de données
- `@supabase/supabase-js` - Client Supabase pour l'authentification, le temps réel et le stockage

## 🔧 Configuration

### Variables d'environnement (`.env`)

```bash
# Database (utilisé par Prisma)
DATABASE_URL="postgresql://postgres:***@db.aqdqmonfendrepcfgcoe.supabase.co:5432/postgres"

# Supabase (utilisé par le client Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://aqdqmonfendrepcfgcoe.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

## 📝 Utilisation

### Option 1: Prisma (Recommandé pour les opérations CRUD)

Utilisez Prisma pour toutes vos opérations de base de données standard :

```typescript
import prisma from '@/lib/prisma'

// Créer un partenaire
const partner = await prisma.partner.create({
  data: {
    name: 'Acme Corp',
    email: 'contact@acme.com',
    isCustomer: true,
  }
})

// Lire les produits
const products = await prisma.product.findMany({
  include: {
    category: true,
  }
})

// Mettre à jour une vente
const sale = await prisma.sale.update({
  where: { id: 'xxx' },
  data: { status: 'POSTED' }
})
```

### Option 2: Supabase Client (Pour Auth, Realtime, Storage)

Utilisez le client Supabase pour les fonctionnalités avancées :

```typescript
import { supabase } from '@/lib/supabase'

// 🔐 Authentification
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// 📡 Temps réel (écouter les changements)
const channel = supabase
  .channel('sales-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'Sale' },
    (payload) => {
      console.log('Changement détecté:', payload)
    }
  )
  .subscribe()

// 📁 Stockage de fichiers
const { data: uploadData, error: uploadError } = await supabase
  .storage
  .from('invoices')
  .upload('invoice-001.pdf', file)
```

## 🎯 Quand utiliser quoi ?

| Fonctionnalité | Outil à utiliser |
|----------------|------------------|
| CRUD (Create, Read, Update, Delete) | **Prisma** |
| Requêtes complexes avec relations | **Prisma** |
| Transactions | **Prisma** |
| Authentification | **Supabase** |
| Temps réel / Subscriptions | **Supabase** |
| Stockage de fichiers | **Supabase** |
| Row Level Security (RLS) | **Supabase** |

## 🚀 Prochaines étapes

1. **Générer le client Prisma** : `npx prisma generate`
2. **Migrer la base de données** : `npx prisma db push`
3. **Configurer l'authentification Supabase** dans votre dashboard
4. **Activer Row Level Security** si nécessaire
