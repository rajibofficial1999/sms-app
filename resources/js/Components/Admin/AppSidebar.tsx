import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";

import { LayoutDashboard } from "lucide-react";
import SidebarProfileDropdown from "./SidebarProfileDropdown";

export const adminSidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: "Dashboard",
        href: route("admin.dashboard"),
        Icon: LayoutDashboard,
    },
    {
        id: 2,
        name: "Orders",
        href: route("admin.orders.index"),
        Icon: LayoutDashboard,
    },
    {
        id: 3,
        name: "Payment methods",
        href: route("admin.payment-methods.index"),
        Icon: LayoutDashboard,
    },
    {
        id: 4,
        name: "Roles",
        href: route("admin.roles.index"),
        Icon: LayoutDashboard,
    },
];

const AppSidebar = () => {
    const { url } = usePage();

    return (
        <div className="flex flex-col justify-between h-full mb-4">
            <ul>
                {adminSidebarOptions.map((option) => {
                    const Icon = option.Icon;
                    return (
                        <li key={option.id}>
                            <Link
                                as="button"
                                href={option.href}
                                className={cn(
                                    "text-gray-700 w-full group flex items-center gap-x-1 rounded-md p-2 text-sm leading-6 font-semibold my-1 px-3 md:px-4 hover:bg-gray-100",
                                    {
                                        "bg-gray-100":
                                            option.href.endsWith(url),
                                    }
                                )}
                            >
                                <Icon className="size-4" /> {option.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <SidebarProfileDropdown />
        </div>
    );
};

export default AppSidebar;
