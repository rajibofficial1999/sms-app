import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";

import {
    Banknote,
    DoorOpen,
    LayoutDashboard,
    ListOrdered,
    NotebookTabs,
    UserCog,
    Users,
} from "lucide-react";
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
        name: "Users",
        href: route("admin.users.index"),
        Icon: Users,
    },
    {
        id: 3,
        name: "Orders",
        href: route("admin.orders.index"),
        Icon: ListOrdered,
    },
    {
        id: 4,
        name: "Payment methods",
        href: route("admin.payment-methods.index"),
        Icon: Banknote,
    },
    {
        id: 5,
        name: "Phone numbers",
        href: route("admin.phone-numbers.index"),
        Icon: NotebookTabs,
    },
    {
        id: 6,
        name: "Admin users",
        href: route("admin.admin-users.index"),
        Icon: UserCog,
    },
    {
        id: 7,
        name: "Roles",
        href: route("admin.roles.index"),
        Icon: DoorOpen,
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
                                    "text-gray-700 text-nowrap w-full group flex items-center gap-x-1 rounded-md p-2 text-sm leading-6 font-semibold my-1 px-3 md:px-4 hover:bg-gray-100",
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
