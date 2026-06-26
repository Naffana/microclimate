import { auth } from "@/auth";
import Page_info from "../../ui/table/page-info";
import { redirect } from "next/navigation";

async function page(props: { params: Promise<{ id: number }>; searchParams: Promise<{ dateFrom?:string; dateTo?: string }>;}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const source = params.id;
    const session = await auth();

    if (!session) {
        redirect("/auth"); 
    }
    return (
        <div>
           <Page_info source={source} searchParams={searchParams}/>
        </div>
    );
}

export default page;