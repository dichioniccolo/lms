import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/ui/card";

import { getAnalytics } from "~/app/_api/get-analytics";
import { getCurrentUser } from "~/app/_api/get-user";
import { formatPrice, isTeacher } from "~/lib/utils";
import { Charts } from "./_components/charts";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isTeacher(user.email)) {
    redirect("/dashboard");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(user.id);

  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>
      </div>
      <Charts data={data} />
    </div>
  );
}
