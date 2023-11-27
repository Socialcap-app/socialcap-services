# Mina zkApp: Offchain Storage

This template uses TypeScript.

## How to build

```sh
npm run build
```

## How to run tests

Node: **Node 19.x** from `nvm use stable`

Install: [Getting Started w/ Typescript](https://www.fastify.io/docs/latest/Reference/TypeScript/)

Commands:
- `npx prisma generate` : generate prisma client
- `npx prisma migrate dev`: migrate Db and recreate PrismaClient
- `npx prisma db seed`: seeding the db
- `npm run build`: build only
- `npm run start`: run server
