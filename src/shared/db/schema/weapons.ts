import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'

export const weapons = pgTable('weapons', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	behavior: text('behavior'),
	location: text('location'),
})

export type Weapon = typeof weapons.$inferSelect
export type NewWeapon = typeof weapons.$inferInsert
