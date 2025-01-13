import { load } from 'cheerio'
import { eq } from 'drizzle-orm'
import { db } from '../../shared/db'
import {
	type Armor,
	type NewArmor,
	armors,
} from '../../shared/db/schema/armors'
import { BaseScraper } from './base.scraper'

export class ArmorsScraper extends BaseScraper {
	private baseUrl = 'https://blackmythwukong.fandom.com/wiki'

	async scrapeArmors() {
		try {
			const html = await this.rateLimitedFetch(`${this.baseUrl}/armors`)
			const $ = load(html)

			const armorItems = $('.wikia-gallery-item .lightbox-caption a')
				.map((_, el) => ({
					href: $(el).attr('href'),
					name: $(el).text().trim(),
				}))
				.get()
				.filter((item): item is { href: string; name: string } =>
					Boolean(item.href && item.name),
				)

			console.log(`📝 Found ${armorItems.length} armors to process`)

			// Get all existing armors with their current data
			const existingArmors = await db.select().from(armors)
			const existingArmorsMap = new Map(existingArmors.map((a) => [a.name, a]))

			for (const [index, item] of armorItems.entries()) {
				console.log(`\n🔍 Processing armor ${index + 1}/${armorItems.length}`)
				const fullUrl = item.href.startsWith('http')
					? item.href
					: `https://blackmythwukong.fandom.com${item.href}`

				const existingArmor = existingArmorsMap.get(item.name)
				await this.scrapeArmorDetails(fullUrl, existingArmor)
			}

			console.log('\n✅ Armors processing completed!')
		} catch (error) {
			console.error('❌ Error processing armors:', error)
		}
	}

	private async scrapeArmorDetails(url: string, existingArmor?: Armor) {
		try {
			const html = await this.rateLimitedFetch(url)
			const $ = load(html)

			const name = $('h1.page-header__title').text().trim()
			const dataElements = $('[data-source]')

			// Scrape new data
			const newData: NewArmor = {
				name,
				type: '',
				rarity: '',
				defense: 0,
				set_bonus: '',
				set: '',
				effect: $('h2:contains("Description") + p').text().trim(),
			}

			dataElements.each((_, el) => {
				const dataSource = $(el).attr('data-source')
				const value = $(el).find('.pi-data-value').text().trim()

				switch (dataSource) {
					case 'type':
						newData.type = value
						break
					case 'rarity':
						newData.rarity = value
						break
					case 'defense':
						newData.defense = Number.parseInt(value.split('/')[0], 10)
						break
					case 'setbonus':
						newData.set_bonus = value
						break
					case 'set':
						newData.set = value
						break
				}
			})

			if (existingArmor) {
				// Check if data has changed
				const hasChanged =
					existingArmor.type !== newData.type ||
					existingArmor.rarity !== newData.rarity ||
					existingArmor.defense !== newData.defense ||
					existingArmor.set_bonus !== newData.set_bonus ||
					existingArmor.set !== newData.set ||
					existingArmor.effect !== newData.effect

				if (hasChanged) {
					console.log('🔄 Updating existing armor data...')
					await db
						.update(armors)
						.set(newData)
						.where(eq(armors.id, existingArmor.id))
					console.log('✅ Armor updated successfully!')
				} else {
					console.log('⏩ No changes detected, skipping update')
				}
			} else {
				console.log('📦 Saving new armor data...')
				await db.insert(armors).values(newData)
				console.log('✅ New armor saved successfully!')
			}
		} catch (error) {
			console.error('❌ Error processing armor details:', error)
		}
	}
}
