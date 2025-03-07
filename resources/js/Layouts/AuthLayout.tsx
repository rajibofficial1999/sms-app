import { PropsWithChildren } from "react";
import MobileSidebar from "@/Components/MobileSidebar";
import SubSidebar from "@/Components/SubSidebar";

export const metadata = {
    title: "FriendZone | Dashboard",
    description: "Your dashboard",
};

const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="w-full flex h-screen">
            <div className="md:hidden">
                <MobileSidebar chatLists={[]} />
            </div>

            <SubSidebar className="hidden md:flex" />

            <aside className="max-h-screen w-full mt-14 md:mt-0 overflow-hidden">
                {children}
            </aside>
        </div>
    );
};
export default AuthLayout;
