import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
    href: string;
    name: string;
    Icon: LucideIcon;
    isMobileLink?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
    href,
    name,
    Icon,
    isMobileLink = false,
}) => {
    const { url } = usePage();

    const isActive = () => {
        return href.endsWith(url);
    };

    return (
        <Link
            as="button"
            href={href}
            className={cn(
                "text-gray-700 text-nowrap w-full group flex items-center gap-x-1 rounded-md p-2 text-sm leading-6 font-semibold my-1 px-3 md:px-4 hover:bg-gray-100",
                {
                    "bg-gray-100": isActive(),
                }
            )}
        >
            {isMobileLink ? (
                <span className="text-gray-400 border-gray-200  flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                    <Icon className="h-4 w-4" />
                </span>
            ) : (
                <Icon className="size-4" />
            )}

            <span className="truncate">{name}</span>
        </Link>
    );
};

export default SidebarLink;
