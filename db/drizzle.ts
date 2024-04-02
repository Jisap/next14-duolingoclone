import "dotenv/config"
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

export const client = postgres(connectionString!, { prepare: false }); // Cliente que maneja la conexión a la bd
export const db = drizzle(client, { schema });                         // ORM que maneja las peticiones al cliente 