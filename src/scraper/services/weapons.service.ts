import { load } from 'cheerio'
import { db } from '../../shared/db'
import { type NewWeapon, weapons } from '../../shared/db/schema/weapons'
import { BaseScraper } from './base.scraper'

export class WeaponsScraper extends BaseScraper {
	private baseUrl = 'https://blackmythwukong.fandom.com/wiki'

	async scrapeWeapons() {
		try {
			console.log('\n⚔️  Starting weapons scraping...')
			const html = await this.rateLimitedFetch(`${this.baseUrl}/weapons`)
			const $ = load(html)

			const weaponLinks = $('.pi-image-thumbnail')
				.map((_, el) => {
					return $(el).parent().attr('href')
				})
				.get()

			console.log(`📝 Found ${weaponLinks.length} weapons to scrape`)

			for (const [index, link] of weaponLinks.entries()) {
				console.log(`\n🔍 Scraping weapon ${index + 1}/${weaponLinks.length}`)
				await this.scrapeWeaponDetails(link)
			}

			console.log('\n✅ Weapons scraping completed!')
		} catch (error) {
			console.error('❌ Error scraping weapons:', error)
		}
	}

	private async scrapeWeaponDetails(url: string) {
		try {
			const html = await this.rateLimitedFetch(url)
			const $ = load(html)

			const weapon: NewWeapon = {
				name: $('[data-source="name"]').text().trim(),
				description: $('.mw-parser-output p').first().text().trim(),
				behavior: $('[data-source="behavior"] .pi-data-value').text().trim(),
				location: $('[data-source="location"] .pi-data-value').text().trim(),
			}

			console.log('📦 Scraped weapon data:', weapon)
			console.log('💾 Saving to database...')

			await db.insert(weapons).values(weapon)
			console.log('✅ Saved to database successfully!')
		} catch (error) {
			console.error('❌ Error scraping weapon details:', error)
		}
	}
}
