import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL is required')

export default defineConfig({
	out: './drizzle',
	schema: './src/shared/db/schema',
	dialect: 'postgresql',
	dbCredentials: {
		url: dbUrl,
	},
})
