import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Toaster } from "@/Components/ui/sonner";
import { PropsWithChildren } from "react";

export const metadata = {
    title: "FriendZone | Dashboard",
    description: "Your dashboard",
};

const RootLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="w-full flex h-screen overflow-hidden">
            <Toaster />
            <ScrollArea className="flex-1 overflow-auto">
                <Navbar />
                {children}
                <Footer />
            </ScrollArea>
        </div>
    );
};
export default RootLayout;
