import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'

export const armors = pgTable('armors', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	rarity: varchar('rarity', { length: 100 }),
	defense: integer('defense'),
	set_bonus: text('set_bonus'),
	set: varchar('set', { length: 255 }),
	effect: text('effect'),
	type: varchar('type', { length: 100 }),
})

export type Armor = typeof armors.$inferSelect
export type NewArmor = typeof armors.$inferInsert
