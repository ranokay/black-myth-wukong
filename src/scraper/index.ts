import { ArmorsScraper } from './services/armors.service'
import { WeaponsScraper } from './services/weapons.service'

const runScrapers = async () => {
	console.log('🚀 Starting scrapers...\n')
	console.log(
		'⏳ This may take a while due to rate limiting (1 second between requests)',
	)

	const armorsScraper = new ArmorsScraper()
	const weaponsScraper = new WeaponsScraper()

	await Promise.all([
		armorsScraper.scrapeArmors(),
		weaponsScraper.scrapeWeapons(),
	])

	console.log('\n🎉 All scraping completed!')
}

runScrapers().catch((error) => {
	console.error('❌ Fatal error:', error)
	process.exit(1)
})
