import AppSidebar from "@/Components/Admin/AppSidebar";
import MobileSidebar from "@/Components/Admin/MobileSidebar";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Toaster } from "@/Components/ui/sonner";
import { PropsWithChildren } from "react";

export const metadata = {
    title: "FriendZone | Dashboard",
    description: "Your dashboard",
};

const ChatLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Toaster />
            <div className="w-full flex h-screen">
                <div className="lg:hidden">
                    <MobileSidebar />
                </div>

                <div className="hidden lg:flex h-full w-full flex-nowrap max-w-72 grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
                    <div className="flex items-center px-4 mt-2 gap-2">
                        <ApplicationLogo className="size-7" />
                        LOgo
                    </div>

                    <nav className="flex flex-1 flex-col px-2">
                        <AppSidebar />
                    </nav>
                </div>

                <ScrollArea className="w-full max-h-screen">
                    <aside className=" w-full mt-14 lg:mt-0 p-4 bg-gray-100 min-h-screen">
                        {children}
                    </aside>
                </ScrollArea>
            </div>
        </>
    );
};
export default ChatLayout;
