import { fetchLinks } from "../lib/data";
import Nav from "../ui/navigations/nav";
import { auth } from "@/auth";
import Providers from "../providers";
import {AdminTopBar} from "../ui/Admin/adminBar"

export  default async function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = await fetchLinks();
  const session = await auth();
  return (
    <Providers session={session ?? undefined}>
    <div className="flex h-full">
        <div className="lg:w-[22%] 2xl:w-[17%]">
          <Nav links={links}/>
        </div>
      <div className="flex-1 min-h-screen flex flex-col">
      <AdminTopBar />
      <main className="flex-1 p-4">
        {children}
      </main>
      </div>
    </div>
    </Providers>
  );
}
