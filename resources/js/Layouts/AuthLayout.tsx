import { PropsWithChildren } from "react";
import MobileSidebar from "@/Components/MobileSidebar";
import SubSidebar from "@/Components/SubSidebar";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

export const metadata = {
    title: "FriendZone | Dashboard",
    description: "Your dashboard",
};

const AuthLayout = ({ children }: PropsWithChildren) => {
    const { url } = usePage();

    return (
        <div className="w-full flex h-screen">
            <div className="md:hidden">
                <MobileSidebar />
            </div>

            <SubSidebar className="hidden md:flex" />

            <aside
                className={cn(
                    "max-h-screen w-full mt-14 md:mt-0 overflow-hidden",
                    {
                        "bg-gray-100": url === "/dashboard",
                    }
                )}
            >
                {children}
            </aside>
        </div>
    );
};
export default AuthLayout;
