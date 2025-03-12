import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { adminSidebarOptions } from "./AppSidebar";
import SidebarProfileDropdown from "./SidebarProfileDropdown";

const SidebarMobileMenu = () => {
    const { url } = usePage();
    return (
        <div className="flex flex-col justify-between h-full mt-2 mx-2 mb-4">
            <ul className="space-y-1">
                {adminSidebarOptions.map((option) => {
                    const Icon = option.Icon;
                    return (
                        <li key={option.id}>
                            <Link
                                href={option.href}
                                className={cn(
                                    "text-gray-700  group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100",
                                    {
                                        "bg-gray-100":
                                            option.href.endsWith(url),
                                    }
                                )}
                            >
                                <span className="text-gray-400 border-gray-200  flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                    <Icon className="h-4 w-4" />
                                </span>

                                <span className="truncate">{option.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <SidebarProfileDropdown />
        </div>
    );
};

export default SidebarMobileMenu;
