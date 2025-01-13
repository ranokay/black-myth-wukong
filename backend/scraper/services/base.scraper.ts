import { setTimeout } from 'node:timers/promises'

export abstract class BaseScraper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private cache: Map<string, { data: any; timestamp: number }> = new Map()
	private lastRequestTime = 0
	private readonly RATE_LIMIT_DELAY = 1000 // 1 second between requests
	private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

	protected async rateLimitedFetch(url: string) {
		// Check cache first
		const cached = this.cache.get(url)
		if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
			console.log(`🔵 Using cached data for: ${url}`)
			return cached.data
		}

		// Rate limiting
		const timeSinceLastRequest = Date.now() - this.lastRequestTime
		if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
			const waitTime = this.RATE_LIMIT_DELAY - timeSinceLastRequest
			console.log(`⏳ Rate limiting - waiting ${waitTime}ms`)
			await setTimeout(waitTime)
		}

		// Make request
		console.log(`🔄 Fetching: ${url}`)
		const response = await fetch(url)
		const data = await response.text()

		// Update cache and timestamp
		this.cache.set(url, { data, timestamp: Date.now() })
		this.lastRequestTime = Date.now()
		console.log(`✅ Fetched and cached: ${url}`)

		return data
	}
}
