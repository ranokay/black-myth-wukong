import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '../../shared/db'
import { armors } from '../../shared/db/schema/armors'

export const armorsRouter = new Elysia({ prefix: '/armors' })
	.get('/', async () => {
		return await db.select().from(armors)
	})
	.get('/:id', async ({ params: { id } }) => {
		return await db
			.select()
			.from(armors)
			.where(eq(armors.id, Number.parseInt(id)))
			.limit(1)
	})
