import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '../../shared/db'
import { weapons } from '../../shared/db/schema/weapons'

export const weaponsRouter = new Elysia({ prefix: '/weapons' })
	.get('/', async () => {
		return await db.select().from(weapons)
	})
	.get('/:id', async ({ params: { id } }) => {
		return await db
			.select()
			.from(weapons)
			.where(eq(weapons.id, Number.parseInt(id)))
			.limit(1)
	})
