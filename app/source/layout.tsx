import { fetchLinks } from "../lib/data";
import Nav from "../ui/navigations/nav";
import { auth } from "@/auth";
import Providers from "../providers";


export  default async function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = await fetchLinks();
  const session = await auth();
  return (
    <Providers session={session ?? undefined}>
    <div className="flex ">
        <div className="lg:w-[22%] 2xl:w-[17%]">
          <Nav links={links}/>
        </div>
        <div  className="lg:w-[78%] 2xl:w-[83%]">
          {children}
        </div>
    </div>
    </Providers>
  );
}
