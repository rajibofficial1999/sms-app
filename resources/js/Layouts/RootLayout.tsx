import Navbar from "@/Components/Navbar";
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
            <main className="flex-1 overflow-auto">
                <Navbar />
                {children}
            </main>
        </div>
    );
};
export default RootLayout;
