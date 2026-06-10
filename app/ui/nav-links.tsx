'use client'

import Link from "next/link";
import { fetchLinks } from "../lib/data";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

interface NavLinks {
  links: { name: string; url: string }[];
}

function Navlinks({links}:NavLinks) {
   const links_home = [{name: 'Главная', url: "/"}, ...links];
   const pathname = usePathname();
    return (
        <>
        <div className="text-text">
            <Link href={links_home[0].url}>
                <p className={clsx(
                     "bg-secondary rounded-2xl p-2 mx-2 my-3 text-center md:text-lg lg:text-3xl",
                     {
                        'text-accent-red font-semibold': pathname === links_home[0].url,
                     },
                     )}>
                    {links_home[0].name}
                </p>
            </Link>
        </div>
        <div className="bg-secondary rounded-2xl mx-2 text-nowrap text-text md:text-[14px] lg:text-xl xl:text-2xl">
            {links_home?.slice(1).map((link)=>(
                <Link href={link.url} key={link.name} className={clsx("flex flex-col items-center",
                    {
                      'text-accent-red font-semibold ': pathname === link.url,  
                    },
                )}>
                    <p className="px-2 py-1" >{link.name}</p>
                    <hr className="w-[80%] h-0.5 bg-border border-0 mt-1" />
                </Link>
            ))}
        </div>
        </>
        
    );
}

export default Navlinks;