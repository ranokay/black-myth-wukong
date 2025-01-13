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
import type { Armor } from "@/lib/types";
import { useEffect, useState } from "react";

interface ArmorsListProps {
	armors: Armor[];
	isLoading: boolean;
}

export function ArmorsList({ armors, isLoading }: ArmorsListProps) {
	const [filteredArmors, setFilteredArmors] = useState<Armor[]>(armors);
	const [rarityFilter, setRarityFilter] = useState<string | null>(null);
	const [typeFilter, setTypeFilter] = useState<string | null>(null);

	useEffect(() => {
		let filtered = armors;
		if (rarityFilter) {
			filtered = filtered.filter((armor) => armor.rarity === rarityFilter);
		}
		if (typeFilter) {
			filtered = filtered.filter((armor) => armor.type === typeFilter);
		}
		setFilteredArmors(filtered);
	}, [armors, rarityFilter, typeFilter]);

	const rarityOptions = Array.from(
		new Set(armors.map((armor) => armor.rarity).filter(Boolean)),
	);
	const typeOptions = Array.from(
		new Set(armors.map((armor) => armor.type).filter(Boolean)),
	);

	if (isLoading) {
		return <Card className="p-6">Loading...</Card>;
	}

	return (
		<Card className="p-6">
			<div className="flex gap-4 mb-6">
				<FilterSelect
					value={rarityFilter}
					onValueChange={setRarityFilter}
					options={rarityOptions}
					placeholder="Filter by Rarity"
				/>
				<FilterSelect
					value={typeFilter}
					onValueChange={setTypeFilter}
					options={typeOptions}
					placeholder="Filter by Type"
				/>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Rarity</TableHead>
						<TableHead>Defense</TableHead>
						<TableHead>Set</TableHead>
						<TableHead>Effect</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredArmors.map((armor) => (
						<TableRow key={armor.id}>
							<TableCell className="font-medium">{armor.name}</TableCell>
							<TableCell>{armor.type}</TableCell>
							<TableCell>{armor.rarity}</TableCell>
							<TableCell>{armor.defense}</TableCell>
							<TableCell>{armor.set}</TableCell>
							<TableCell className="max-w-md">{armor.effect}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
