'use client'
import Link from "next/link";
import Navlinks from "./nav-links";
import { fetchLinks } from "../../lib/data";
import Image from "next/image";
import logo from "@/public/1.png"
import { useSession, signOut } from "next-auth/react";
import { links } from "@/app/lib/definitions";

function Nav({links}:{links:links[]}) {
    const { data: session, status } = useSession();
    const role = session?.user?.role?.trim() as string | undefined;
    
    return(
        <div className="h-screen fixed flex flex-col  bg-accent text-secondary ">
        <div className="h-[20%] my-5 ">
        <div className="flex flex-row justify-center items-center -mb-5">
            <Image src={logo} alt="Микроклимат" 
            className="w-20"/>
            <h1 className="text-secondary   text-[32px]">икроклимат</h1>
        </div>
         <p className="text-text font-medium text-lg text-center">{role}</p>
        </div>
        <div className="h-70% align-middle">
            <Navlinks links = {links}/>
        </div>
        <div className="w-full flex flex-col justify-center items-center  mt-auto">
        {role === "Администратор" &&
        <Link href="/" className="text-center bg-border text-text w-[80%] py-1 text-md mb-2 rounded-lg">
            Админ-панель
        </Link>
        }
        <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/auth" })}
        className="rounded-lg bg-accent-red px-3 py-1 font-medium w-[80%] mb-5 cursor-pointer h-10 text-secondary text-lg  hover:bg-accent-red/80"
        >
        {role ? "Выход" : "Авторизация"}
        </button>
        </div>
        </div>
    )
}

export default Nav;