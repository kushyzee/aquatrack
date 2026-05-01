"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Download, Search } from "lucide-react";

export default function HarvestDataDetails() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-end gap-3">
          <Button variant="outline">
            <Download /> Download CSV
          </Button>
          <InputGroup>
            <InputGroupInput
              placeholder="Search by buyer's name"
              onChange={(e) => console.log(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </CardHeader>
    </Card>
  );
}
