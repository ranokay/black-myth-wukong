"use client";

import { ArmorsList } from "@/components/armors-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeaponsList } from "@/components/weapons-list";
import { API_URL } from "@/lib/config";
import type { Armor, Weapon } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
	const [armors, setArmors] = useState<Armor[]>([]);
	const [weapons, setWeapons] = useState<Weapon[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			fetch(`${API_URL}/armors`).then((res) => res.json()),
			fetch(`${API_URL}/weapons`).then((res) => res.json()),
		])
			.then(([armorsData, weaponsData]) => {
				setArmors(armorsData);
				setWeapons(weaponsData);
			})
			.finally(() => setIsLoading(false));
	}, []);

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
						<ArmorsList armors={armors} isLoading={isLoading} />
					</TabsContent>
					<TabsContent value="weapons">
						<WeaponsList weapons={weapons} isLoading={isLoading} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
