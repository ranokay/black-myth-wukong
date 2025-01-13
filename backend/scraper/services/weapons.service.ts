import { load } from 'cheerio'
import { eq } from 'drizzle-orm'
import { db } from '../../shared/db'
import {
	type NewWeapon,
	type Weapon,
	weapons,
} from '../../shared/db/schema/weapons'
import { BaseScraper } from './base.scraper'

export class WeaponsScraper extends BaseScraper {
	private baseUrl = 'https://blackmythwukong.fandom.com/wiki'

	async scrapeWeapons() {
		try {
			const html = await this.rateLimitedFetch(`${this.baseUrl}/weapons`)
			const $ = load(html)

			const weaponItems = $('.wikia-gallery-item .lightbox-caption a')
				.map((_, el) => ({
					href: $(el).attr('href'),
					name: $(el).text().trim(),
				}))
				.get()
				.filter((item): item is { href: string; name: string } =>
					Boolean(item.href && item.name),
				)

			console.log(`📝 Found ${weaponItems.length} weapons to process`)

			// Get all existing weapons with their current data
			const existingWeapons = await db.select().from(weapons)
			const existingWeaponsMap = new Map(
				existingWeapons.map((w) => [w.name, w]),
			)

			for (const [index, item] of weaponItems.entries()) {
				console.log(`\n🔍 Processing weapon ${index + 1}/${weaponItems.length}`)
				const fullUrl = item.href.startsWith('http')
					? item.href
					: `https://blackmythwukong.fandom.com${item.href}`

				const existingWeapon = existingWeaponsMap.get(item.name)
				await this.scrapeWeaponDetails(fullUrl, existingWeapon)
			}

			console.log('\n✅ Weapons processing completed!')
		} catch (error) {
			console.error('❌ Error processing weapons:', error)
		}
	}

	private async scrapeWeaponDetails(url: string, existingWeapon?: Weapon) {
		try {
			const html = await this.rateLimitedFetch(url)
			const $ = load(html)

			const name = $('h1.page-header__title').text().trim()
			const dataElements = $('[data-source]')

			// Scrape new data
			const newData: NewWeapon = {
				name,
				description: $('h2:contains("Description") + p').text().trim(),
				rarity: '',
				attack: 0,
				crit: '',
			}

			dataElements.each((_, el) => {
				const dataSource = $(el).attr('data-source')
				const value = $(el).find('.pi-data-value').text().trim()

				switch (dataSource) {
					case 'rarity':
						newData.rarity = value
						break
					case 'attack':
						newData.attack = Number.parseInt(value, 10)
						break
					case 'crit':
						newData.crit = value
						break
				}
			})

			if (existingWeapon) {
				// Check if data has changed
				const hasChanged =
					existingWeapon.description !== newData.description ||
					existingWeapon.rarity !== newData.rarity ||
					existingWeapon.attack !== newData.attack ||
					existingWeapon.crit !== newData.crit

				if (hasChanged) {
					console.log('🔄 Updating existing weapon data...')
					await db
						.update(weapons)
						.set(newData)
						.where(eq(weapons.id, existingWeapon.id))
					console.log('✅ Weapon updated successfully!')
				} else {
					console.log('⏩ No changes detected, skipping update')
				}
			} else {
				console.log('📦 Saving new weapon data...')
				await db.insert(weapons).values(newData)
				console.log('✅ New weapon saved successfully!')
			}
		} catch (error) {
			console.error('❌ Error processing weapon details:', error)
		}
	}
}
