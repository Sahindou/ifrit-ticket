# Architecture

src/
|__ core/
|   ├── config/
|   │   ├── env.ts                    # Variables d'environnement
|   │   ├── database.ts               # Configuration Drizzle
|   │   └── app.ts                    # Configuration Express
|   ├── database/
|   │   ├── schema/                   # Schémas Drizzle
|   │   │   ├── users.schema.ts
|   │   │   ├── products.schema.ts
|   │   │   └── index.ts
|   │   ├── migrations/               # Migrations Drizzle
|   │   └── seed.ts                   # Données de test
├── features/
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.zod.ts          # zod/validation
│   │   └── user.types.ts
│   └── products/
│       ├── product.routes.ts
│       ├── product.controller.ts
│       ├── product.service.ts
│       └── product.repository.ts
├── shared/
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   └── asyncHandler.ts
│   └── types/
│       └── express.d.ts
├── loaders/
│   ├── express.loader.ts
│   └── index.ts
├── app.ts
└── server.ts
