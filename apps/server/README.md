# Architecture

src/
├── api/
│   ├── routes/
│   │   └── index.ts              # Point d'entrée des routes
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── validation.middleware.ts
│   └── controllers/
│       ├── user.controller.ts
│       └── product.controller.ts
│
├── features/                      # Modules métier (grosses features)
│   ├── users/
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.model.ts
│   │   ├── user.types.ts
│   │   └── user.validation.ts
│   │
│   └── products/
│       ├── product.service.ts
│       ├── product.repository.ts
│       ├── product.model.ts
│       └── product.types.ts
│
├── shared/                        # Code partagé
│   ├── services/
│   │   ├── email.service.ts
│   │   └── storage.service.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── helpers.ts
│   └── types/
│       └── common.types.ts
│
├── core/                          # Configuration & initialisation
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── app.ts
│   ├── loaders/
│   │   ├── express.loader.ts
│   │   ├── database.loader.ts
│   │   └── index.ts
│   └── errors/
│       ├── AppError.ts
│       └── errorCodes.ts
│
├── app.ts                         # Point d'entrée
└── server.ts                      # Démarrage du serveur
