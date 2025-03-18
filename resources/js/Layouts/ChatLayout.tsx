import ChatListHeader from "@/Components/ChatListHeader";
import MobileSidebar from "@/Components/MobileSidebar";
import SidebarChatList from "@/Components/SidebarChatList";
import SubSidebar from "@/Components/SubSidebar";
import { Toaster } from "@/Components/ui/sonner";
import { store } from "@/lib/store";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

export const metadata = {
    title: "FriendZone | Dashboard",
    description: "Your dashboard",
};

const ChatLayout = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <Toaster />
            <div className="w-full flex h-screen">
                <div className="md:hidden">
                    <MobileSidebar />
                </div>

                <SubSidebar className="hidden md:flex" />

                <div className="hidden md:flex h-full w-full max-w-72 grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
                    <ChatListHeader className="mt-2" />

                    <nav className="flex flex-1 flex-col">
                        <SidebarChatList />
                    </nav>
                </div>

                <aside className="max-h-screen w-full mt-14 md:mt-0">
                    {children}
                </aside>
            </div>
        </Provider>
    );
};
export default ChatLayout;
