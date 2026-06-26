import { AreaMapClient } from "@/app/ui/area/Area_refresh";
import { fetchAreaInfo } from "../../lib/data";
import DateFilter from "../../ui/filtr-data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home(props: {searchParams: Promise<{ dateFrom?:string; dateTo?: string }>;}) {
const searchParams = await props.searchParams;
const now = new Date();
const year = now.getUTCFullYear();
const month = now.getUTCMonth();
const day = now.getUTCDate();
const start = searchParams.dateFrom ? new Date(searchParams.dateFrom) : new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
const end = searchParams.dateTo ? new Date(searchParams.dateTo) : new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

const chartdata = await fetchAreaInfo(searchParams.dateFrom, searchParams.dateTo);

const session = await auth();

    if (!session) {
        redirect("/auth"); 
    }
return (
    <div className="min-h-screen">
    <div className="flex justify-center mt-5">
      <DateFilter/>
    </div>
    <div className="">
    <AreaMapClient
          initialData={chartdata}
          start={start}
          end={end}
          dateFrom={searchParams.dateFrom}
          dateTo={searchParams.dateTo}
        />
    </div>
    </div>
  );
}
