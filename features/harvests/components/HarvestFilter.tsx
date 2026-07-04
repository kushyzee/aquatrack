"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface HarvestFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HarvestFilter({ value, onChange }: HarvestFilterProps) {
  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Search by buyer's name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
