import { neon } from '@neondatabase/serverless';

const databaseUrl = 'postgresql://neondb_owner:npg_cRgAxeP9Zk3F@ep-young-feather-amjzqznk-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(databaseUrl);
const result = await sql`SELECT email, password_hash FROM users WHERE email = 'maocorread.@gmail.com'`;
console.log('User:', JSON.stringify(result));