import { load } from 'cheerio'
import { db } from '../../shared/db'
import { type NewArmor, armors } from '../../shared/db/schema/armors'
import { BaseScraper } from './base.scraper'

export class ArmorsScraper extends BaseScraper {
	private baseUrl = 'https://blackmythwukong.fandom.com/wiki'

	async scrapeArmors() {
		try {
			console.log('\n🛡️  Starting armor scraping...')
			const html = await this.rateLimitedFetch(`${this.baseUrl}/armors`)
			const $ = load(html)

			const armorLinks = $('.pi-image-thumbnail')
				.map((_, el) => {
					return $(el).parent().attr('href')
				})
				.get()

			console.log(`📝 Found ${armorLinks.length} armors to scrape`)

			for (const [index, link] of armorLinks.entries()) {
				console.log(`\n🔍 Scraping armor ${index + 1}/${armorLinks.length}`)
				await this.scrapeArmorDetails(link)
			}

			console.log('\n✅ Armor scraping completed!')
		} catch (error) {
			console.error('❌ Error scraping armors:', error)
		}
	}

	private async scrapeArmorDetails(url: string) {
		try {
			const html = await this.rateLimitedFetch(url)
			const $ = load(html)

			const armor: NewArmor = {
				name: $('[data-source="name"]').text().trim(),
				type: $('[data-source="type"] .pi-data-value').text().trim(),
				rarity: $('[data-source="rarity"] .pi-data-value').text().trim(),
				defense: Number.parseInt(
					$('[data-source="defense"] .pi-data-value').text().trim(),
					10,
				),
				set_bonus: $('[data-source="setbonus"] .pi-data-value').text().trim(),
				set: $('[data-source="set"] .pi-data-value').text().trim(),
				effect: $('.mw-parser-output p').first().text().trim(),
			}

			console.log('📦 Scraped armor data:', armor)
			console.log('💾 Saving to database...')

			await db.insert(armors).values(armor)
			console.log('✅ Saved to database successfully!')
		} catch (error) {
			console.error('❌ Error scraping armor details:', error)
		}
	}
}
