import { fetchListRoles } from "../lib/data";
import Auth from "../ui/auth";

async function page() {
    const roles = await fetchListRoles();
    return (
        <div className="w-full h-screen bg-secondary">
            <Auth roles={roles}/>
        </div>
    );
}

export default page