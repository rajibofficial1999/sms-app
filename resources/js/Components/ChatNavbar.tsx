import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { EllipsisVertical, UserRound } from "lucide-react";
import React, { FC } from "react";

interface ChatNavbarProps {
    className?: string;
}

const ChatNavbar: FC<ChatNavbarProps> = ({ className }) => {
    const { conversation } = usePage().props;
    return (
        <div
            className={cn(
                "py-3 px-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between",
                className
            )}
        >
            <div className="flex items-center gap-x-1">
                <div
                    className="size-8 rounded-full flex-shrink-0 relative flex justify-center items-center text-white"
                    style={{
                        backgroundColor: conversation.avatar_color,
                    }}
                >
                    <UserRound className="size-4" />
                </div>
                <p className="font-semibold text-gray-600">
                    {conversation?.traffic_number}
                </p>
            </div>
            <button>
                <EllipsisVertical className="size-5 text-gray-600" />
            </button>
        </div>
    );
};

export default ChatNavbar;
