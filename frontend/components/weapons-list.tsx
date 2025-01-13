"use client";

import { Card } from "@/components/ui/card";
import { FilterSelect } from "@/components/ui/filter-select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { API_URL } from "@/lib/config";
import type { Weapon } from "@/lib/types";
import { useEffect, useState } from "react";

export function WeaponsList() {
	const [weapons, setWeapons] = useState<Weapon[]>([]);
	const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([]);
	const [rarityFilter, setRarityFilter] = useState<string | null>(null);

	useEffect(() => {
		fetch(`${API_URL}/weapons`)
			.then((res) => res.json())
			.then(setWeapons);
	}, []);

	useEffect(() => {
		let filtered = weapons;
		if (rarityFilter) {
			filtered = filtered.filter((weapon) => weapon.rarity === rarityFilter);
		}
		setFilteredWeapons(filtered);
	}, [weapons, rarityFilter]);

	const rarityOptions = Array.from(
		new Set(weapons.map((weapon) => weapon.rarity).filter(Boolean)),
	);

	return (
		<Card className="p-6">
			<div className="flex gap-4 mb-6">
				<FilterSelect
					value={rarityFilter}
					onValueChange={setRarityFilter}
					options={rarityOptions}
					placeholder="Filter by Rarity"
				/>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Rarity</TableHead>
						<TableHead>Attack</TableHead>
						<TableHead>Crit</TableHead>
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredWeapons.map((weapon) => (
						<TableRow key={weapon.id}>
							<TableCell className="font-medium">{weapon.name}</TableCell>
							<TableCell>{weapon.rarity}</TableCell>
							<TableCell>{weapon.attack}</TableCell>
							<TableCell>{weapon.crit}</TableCell>
							<TableCell className="max-w-md">{weapon.description}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
