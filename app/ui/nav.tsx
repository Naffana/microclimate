import Link from "next/link";
import Navlinks from "./nav-links";
import { fetchLinks } from "../lib/data";
import Image from "next/image";
import logo from "@/public/Monolit.png"

async function Nav() {
    const links = await fetchLinks();

    return(
        <div className="h-screen fixed  bg-accent text-secondary ">
        <div className="h-[30%] flex flex-col justify-center items-center">
            <Image src={logo} alt="" className="w-25 h-20"/>
            <h1 className="text-secondary  md:text-4xl 2xl:text-[45px] 2xl:px-2 text-3xl">Микроклимат</h1>
        </div>
        <div className="h-70% align-middle">
            <Navlinks links = {links}/>
        </div>
        </div>
    )
}

export default Nav;