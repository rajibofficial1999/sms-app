import { cn } from "@/lib/utils";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Gem,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Settings,
} from "lucide-react";

export const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: "Dashboard",
        href: route("dashboard"),
        Icon: LayoutDashboard,
    },
    {
        id: 2,
        name: "Messaging",
        href: route("messages.index"),
        Icon: MessageSquare,
    },
    {
        id: 3,
        name: "Settings",
        href: route("profile.edit"),
        Icon: Settings,
    },
    {
        id: 4,
        name: "billings",
        href: route("billings"),
        Icon: Gem,
    },
];

const handleLogout = () => {
    router.post(route("logout"));
};

const SidebarMobileMenu = () => {
    const { url } = usePage();
    return (
        <ul className="mx-2 mt-2 space-y-1">
            {sidebarOptions.map((option) => {
                const Icon = option.Icon;
                return (
                    <li key={option.id}>
                        <Link
                            href={option.href}
                            className={cn(
                                "text-gray-700  group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100",
                                {
                                    "bg-gray-100": option.href.endsWith(url),
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

            <li>
                <button
                    onClick={handleLogout}
                    className="text-gray-700  group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-100 w-full"
                >
                    <span className="text-gray-400 border-gray-200  flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <LogOut className="h-4 w-4" />
                    </span>

                    <span className="truncate">Log Out</span>
                </button>
            </li>
        </ul>
    );
};

export default SidebarMobileMenu;
