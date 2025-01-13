import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FilterSelectProps {
	value: string | null;
	onValueChange: (value: string | null) => void;
	options: string[];
	placeholder: string;
}

export function FilterSelect({
	value,
	onValueChange,
	options,
	placeholder,
}: FilterSelectProps) {
	return (
		<Select
			value={value || undefined}
			onValueChange={(val) => onValueChange(val === "all" ? null : val)}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
