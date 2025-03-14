import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Link, router, usePage } from "@inertiajs/react";
import { BookUser, LogOut, Settings, User } from "lucide-react";

const SidebarProfileDropdown = () => {
    const {
        auth: { admin },
    } = usePage().props;

    const handleLogout = () => {
        router.post(route("admin.logout"));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-x-2">
                    <Avatar className="!size-10">
                        <AvatarImage
                            src={admin.avatar ? `/storage/${admin.avatar}` : ""}
                        />
                        <AvatarFallback>
                            <User className="size-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <h1 className="text-sm font-semibold">{admin.name}</h1>
                        <p className="text-xs">{admin.email}</p>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href={route("admin.profile.edit")}
                        className="w-full cursor-pointer"
                    >
                        <BookUser />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href={route("admin.profile.edit")}
                        className="w-full cursor-pointer"
                    >
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <button
                        type="button"
                        className="w-full cursor-pointer text-red-500 hover:!text-red-600"
                        onClick={handleLogout}
                    >
                        <LogOut />
                        <span>Log Out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SidebarProfileDropdown;
