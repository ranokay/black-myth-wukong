import { client } from '../shared/db'
import { ArmorsScraper } from './services/armors.service'
import { WeaponsScraper } from './services/weapons.service'

const runScrapers = async () => {
	console.log('🚀 Starting scrapers...\n')
	console.log(
		'⏳ This may take a while due to rate limiting (1 second between requests)',
	)

	try {
		// Run scrapers sequentially
		const armorsScraper = new ArmorsScraper()
		console.log('🛡️  Starting Armor scraping...')
		await armorsScraper.scrapeArmors()

		const weaponsScraper = new WeaponsScraper()
		console.log('⚔️  Starting Weapon scraping...')
		await weaponsScraper.scrapeWeapons()

		console.log('\n🎉 All scraping completed successfully!')
	} catch (error) {
		console.error('❌ Fatal error:', error)
		process.exit(1)
	} finally {
		// Close database connection
		await client.end()
		process.exit(0)
	}
}

runScrapers()
