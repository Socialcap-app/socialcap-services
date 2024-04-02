/**
 * Using Postgres driver for improving query performance on 
 * joins and complex queries not available in Prisma.
 * See: https://github.com/porsager/postgres
 */
import "dotenv/config";
import postgres from "postgres";

const PG_DB_URL = (process.env.DATABASE_URL as string).replace('?schema=public','')

const Sql = postgres(PG_DB_URL, { 
  transform: postgres.toCamel,
  /* no other options */ 
}) 
//console.log("Sql connection=", Sql);

export default Sql
