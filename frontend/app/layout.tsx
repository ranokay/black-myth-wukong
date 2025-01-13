import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Black Myth: Wukong Database',
	description: 'Database of armors and weapons from Black Myth: Wukong',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
