# Socialcap services

- API services at main-api.ts

- Sequencer service at main-sequencer.ts

This template uses TypeScript. Install: [Getting Started w/ Typescript](https://www.fastify.io/docs/latest/Reference/TypeScript/)

Node: **Node 19.x** from `nvm use stable`

Commands:

- `npx prisma generate` : generate prisma client
- `npx prisma migrate dev`: migrate Db and recreate PrismaClient
- `npx prisma db seed`: seeding the db
- `npm run build`: build only

Run the services

- `./run-api.sh`: run API server
- `./run-sequencer.sh`: run Sequencer server
