import Page_info from "../../ui/page-info";

async function page(props: { params: Promise<{ id: number }>; searchParams: Promise<{ dateFrom?:string; dateTo?: string }>;}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const source = params.id;
    return (
        <div>
           <Page_info source={source} searchParams={searchParams}/>
        </div>
    );
}

export default page;