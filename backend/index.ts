import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { armorsRouter } from "./api/routes/armors";
import { weaponsRouter } from "./api/routes/weapons";

const app = new Elysia()
	.use(cors())
	.use(armorsRouter)
	.use(weaponsRouter)
	.listen(5001);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
