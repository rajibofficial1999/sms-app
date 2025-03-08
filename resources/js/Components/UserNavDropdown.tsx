import { Link, router, usePage } from "@inertiajs/react";
import { Gem, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

const UserNavDropdown = () => {
    const {
        auth: { user },
    } = usePage().props;

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="overflow-visible">
                <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
                    <UserAvatar />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                        {user && (
                            <p className="font-medium text-sm text-black">
                                {user.name}
                            </p>
                        )}
                        {user && (
                            <p className="w-[200px] truncate text-xs text-zinc-700">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link className="cursor-pointer" href={route("dashboard")}>
                        <LayoutDashboard className="text-blue-600 h-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link className="cursor-pointer" href={route("billings")}>
                        <Gem className="text-blue-600 h-4" />
                        Billings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                    <button
                        className="text-red-500 flex items-center"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4" /> <span>Log out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserNavDropdown;
