import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";

import { LayoutDashboard } from "lucide-react";

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
        name: "Roles",
        href: route("admin.roles.index"),
        Icon: LayoutDashboard,
    },
];

const AppSidebar = () => {
    const { url } = usePage();

    return (
        <ul className="">
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
                                    "bg-gray-100": option.href.endsWith(url),
                                }
                            )}
                        >
                            <Icon className="size-4" /> {option.name}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default AppSidebar;
