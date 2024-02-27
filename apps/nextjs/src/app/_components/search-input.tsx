"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@acme/ui/components/ui/input";
import { useDebounce } from "@acme/ui/hooks/use-debounce";

interface Props {
  title?: string | null;
}

export function SearchInput({ title }: Props) {
  const router = useRouter();

  const [value, setValue] = useState(title ?? "");

  const debouncedTitle = useDebounce(value, 200);

  useEffect(() => {
    if (!debouncedTitle) {
      router.push("/dashboard/search");
      return;
    }

    router.push(`/dashboard/search?title=${debouncedTitle}`);
  }, [debouncedTitle, router]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 size-4 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[300px]"
        placeholder="Cerca un corso"
      />
    </div>
  );
}
