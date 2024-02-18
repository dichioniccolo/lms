import type { ServerRuntime } from "next";

import { HeroComponent } from "../_components/hero-component";
import { CardsList } from "./_components/cards-list";
import { CategoriesList } from "./_components/categories-list";

export const runtime: ServerRuntime = "edge";

export default function Page() {
  return (
    <>
      <HeroComponent />
      <div className="marge-x flex flex-col gap-y-5 pt-8">
        <h1 className="text-heading">Naviga</h1>
        {/* {children} */}
        <div className="flex flex-col gap-y-6">
          <CategoriesList />

          <div className="mb-8">
            <CardsList />
          </div>
        </div>
      </div>
    </>
  );
}
