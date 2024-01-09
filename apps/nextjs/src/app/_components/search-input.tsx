import { Search } from "lucide-react";

import { Input } from "@acme/ui/components/ui/input";

export function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
      <Input
        // onChange={(e) => setValue(e.target.value)}
        // value={value}
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[300px]"
        placeholder="Search for a course"
      />
    </div>
  );
}
