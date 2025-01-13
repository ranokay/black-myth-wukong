export interface Armor {
	id: number
	name: string
	type: string
	rarity: string
	defense: number
	set_bonus: string
	set: string
	effect: string
}

export interface Weapon {
	id: number
	name: string
	description: string
	rarity: string
	attack: number
	crit: string
}
