import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { Gem, LayoutDashboard, MessageSquare, Settings } from "lucide-react";

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
        href: route("settings"),
        Icon: Settings,
    },
    {
        id: 4,
        name: "billings",
        href: route("billings"),
        Icon: Gem,
    },
];

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
                                "text-gray-700  group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                {
                                    "bg-gray-100": url === option.href,
                                    "hover:bg-gray-100": url !== option.href,
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
    );
};

export default SidebarMobileMenu;
