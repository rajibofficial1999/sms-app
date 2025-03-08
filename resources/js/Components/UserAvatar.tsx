import { Avatar, AvatarFallback } from "./ui/avatar";
import React from "react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { User } from "lucide-react";

interface UserAvatarProps {
    className?: string;
    iconClassName?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    className,
    iconClassName,
}) => {
    const {
        auth: { user },
    } = usePage().props;
    return (
        <Avatar className={cn("relative w-8 h-8", className)}>
            {user?.avatar ? (
                <div className="relative aspect-square h-full w-full">
                    <img
                        src={user?.avatar}
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                        width={40}
                        height={40}
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{user?.name}</span>
                    <User
                        className={cn("h-4 w-4 text-zinc-900", iconClassName)}
                    />
                </AvatarFallback>
            )}
        </Avatar>
    );
};

export default UserAvatar;
