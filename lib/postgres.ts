import { Pool, QueryResult, QueryResultRow } from 'pg'

interface QueryParams {
  query: string;
  values?: (string | number | boolean | null)[];
}

// Create a single pool instance to manage connections efficiently
const pool = new Pool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  port: Number(process.env.NEXT_PUBLIC_DB_PORT),
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  
  // Optional additional configurations
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting before timing out
})

export async function Query({ query, values = [] }: QueryParams): Promise<QueryResultRow[]> {
  try {
    const client = await pool.connect()
    
    try {
      const result: QueryResult = await client.query(query, values)
      return result.rows
    } finally {
      // Always release the client back to the pool
      client.release()
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Database query error: ${error.message}`)
    }
    throw new Error('An unknown database error occurred')
  }
}

// Optional: Shutdown method to close the pool when your application exits
export async function closeDbConnection() {
  await pool.end()
}