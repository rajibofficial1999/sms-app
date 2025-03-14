import { cn, formatMessageTime } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { Ban, UserRound } from "lucide-react";

const SidebarChatList = () => {
    const { conversation, chatLists } = usePage().props;

    return (
        <ul className="">
            {chatLists.map((chatList) => (
                <li key={chatList.id}>
                    <Link
                        as="button"
                        href={`/messaging/${chatList.id}`}
                        className={cn(
                            "text-gray-700 w-full group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-3 md:px-4",
                            {
                                "bg-gray-100":
                                    Number(conversation?.id) === chatList.id,
                                "hover:bg-gray-100":
                                    Number(conversation?.id) !== chatList.id,
                                "opacity-70": chatList.is_blocked,
                            }
                        )}
                    >
                        <div
                            className={cn(
                                "size-11 rounded-full flex-shrink-0 relative flex justify-center items-center text-white",
                                {
                                    "!bg-red-500": chatList.is_blocked,
                                }
                            )}
                            style={{
                                backgroundColor: chatList.avatar_color,
                            }}
                        >
                            {chatList.unread_messages_count > 0 && (
                                <div className="bg-indigo-600 absolute right-0 top-0 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                                    {chatList.unread_messages_count}
                                </div>
                            )}
                            {chatList.is_blocked ? (
                                <Ban className="size-5" />
                            ) : (
                                <UserRound className="size-5" />
                            )}
                        </div>
                        <div className="flex flex-col items-start flex-1">
                            <p
                                className={cn("text-gray-500", {
                                    "text-gray-900":
                                        chatList.unread_messages_count > 0,
                                    "text-red-300": chatList.is_blocked,
                                })}
                            >
                                {chatList.traffic_number}
                            </p>
                            <p
                                className={cn(
                                    "text-nowrap truncate w-full max-w-40 md:max-w-48 font-thin text-left text-gray-500 text-sm",
                                    {
                                        "font-semibold text-gray-700":
                                            chatList.unread_messages_count > 0,
                                    }
                                )}
                            >
                                {chatList.last_message_body ?? "..."}
                            </p>
                            <p className="text-xs text-gray-400 font-thin">
                                {chatList.last_message_time &&
                                    formatMessageTime(
                                        chatList.last_message_time
                                    )}
                            </p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default SidebarChatList;
