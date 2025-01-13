"use client";

import { ArmorsList } from "@/components/armors-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeaponsList } from "@/components/weapons-list";

export default function Home() {
	return (
		<div className="container mx-auto py-12 px-4">
			<h1 className="text-4xl font-bold mb-12 text-center">
				Black Myth: Wukong Database
			</h1>

			<div className="max-w-[80%] mx-auto">
				<Tabs defaultValue="armors" className="w-full">
					<TabsList className="justify-center">
						<TabsTrigger value="armors">Armors</TabsTrigger>
						<TabsTrigger value="weapons">Weapons</TabsTrigger>
					</TabsList>
					<TabsContent value="armors">
						<ArmorsList />
					</TabsContent>
					<TabsContent value="weapons">
						<WeaponsList />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
