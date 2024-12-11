import { Elysia } from 'elysia'
import { armorsRouter } from './api/routes/armors'
import { weaponsRouter } from './api/routes/weapons'

const app = new Elysia().use(armorsRouter).use(weaponsRouter).listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
