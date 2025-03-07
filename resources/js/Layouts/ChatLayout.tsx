import { PropsWithChildren } from "react";
import MobileSidebar from "@/Components/MobileSidebar";
import SidebarChatList from "@/Components/SidebarChatList";
import SubSidebar from "@/Components/SubSidebar";
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { UserPlus } from "lucide-react";

export const metadata = {
    title: "FriendZone | Dashboard",
    description: "Your dashboard",
};

const ChatLayout = ({ children }: PropsWithChildren) => {
    const { chatLists } = usePage().props;

    return (
        <div className="w-full flex h-screen">
            <div className="md:hidden">
                <MobileSidebar chatLists={chatLists} />
            </div>

            <SubSidebar className="hidden md:flex" />

            <div className="hidden md:flex h-full w-full max-w-72 grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
                <div className="flex justify-between items-center px-4 mt-2">
                    <p className="text-xs font-semibold leading-6 text-gray-400">
                        Your chats
                    </p>
                    <Button variant="ghost" size="icon">
                        <UserPlus />
                    </Button>
                </div>

                <nav className="flex flex-1 flex-col">
                    <SidebarChatList chatLists={chatLists} />
                </nav>
            </div>

            <aside className="max-h-screen w-full mt-14 md:mt-0">
                {children}
            </aside>
        </div>
    );
};
export default ChatLayout;
