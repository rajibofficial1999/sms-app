import { cn } from "@/lib/utils";
import { Link, router } from "@inertiajs/react";
import { LogOut } from "lucide-react";
import React from "react";
import ApplicationLogo from "./ApplicationLogo";
import { sidebarOptions } from "./SidebarMobileMenu";
import { Button, buttonVariants } from "./ui/button";

interface SubSidebarProps {
    className?: string;
}

const SubSidebar: React.FC<SubSidebarProps> = ({ className }) => {
    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div
            className={cn(
                "max-w-16 w-full grow flex-col items-center gap-y-5 overflow-y-auto border-r border-gray-300 bg-white",
                className
            )}
        >
            <ul className="flex flex-1 flex-col gap-y-4 mt-6">
                <li className="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo className="h-4 w-auto text-indigo-600" />
                    </Link>
                </li>

                {sidebarOptions.map((option) => {
                    const Icon = option.Icon;
                    return (
                        <li className="flex justify-center" key={option.id}>
                            <Link
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                })}
                                as="button"
                                href={option.href}
                            >
                                <Icon className="text-gray-600" />
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="flex justify-center">
                <Button
                    title="Log Out"
                    size="icon"
                    variant="ghost"
                    className="mb-3"
                    onClick={handleLogout}
                >
                    <LogOut className="text-gray-600" />
                </Button>
            </div>
        </div>
    );
};

export default SubSidebar;
