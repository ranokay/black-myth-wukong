import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'

export const weapons = pgTable('weapons', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	rarity: varchar('rarity', { length: 100 }),
	attack: integer('attack'),
	crit: varchar('crit', { length: 100 }),
})

export type Weapon = typeof weapons.$inferSelect
export type NewWeapon = typeof weapons.$inferInsert
