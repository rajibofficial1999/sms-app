import { cn, formatMessageTime } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { UserRound } from "lucide-react";
import { FC } from "react";

interface SidebarChatListProps {
    chatLists: Conversation[];
}

const SidebarChatList: FC<SidebarChatListProps> = ({ chatLists }) => {
    const { conversation } = usePage().props;

    return (
        <ul className="">
            {chatLists.map((chatList) => {
                const unseenMessagesCount = 3;
                const isUnseenMessage = chatList.id === 5;

                return (
                    <li key={chatList.id}>
                        <Link
                            as="button"
                            href={`/messaging/${chatList.id}`}
                            className={cn(
                                "text-gray-700 w-full group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold px-3 md:px-4",
                                {
                                    "bg-gray-100":
                                        Number(conversation?.id) ===
                                        chatList.id,
                                    "hover:bg-gray-100":
                                        Number(conversation?.id) !==
                                        chatList.id,
                                }
                            )}
                        >
                            <div
                                className="size-11 rounded-full flex-shrink-0 relative flex justify-center items-center text-white"
                                style={{
                                    backgroundColor: chatList.avatar_color,
                                }}
                            >
                                {isUnseenMessage && (
                                    <div className="bg-indigo-600 absolute right-0 top-0 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                                        {unseenMessagesCount}
                                    </div>
                                )}
                                <UserRound className="size-5" />
                            </div>
                            <div className="flex flex-col items-start flex-1">
                                <p
                                    className={cn("text-gray-500", {
                                        "text-gray-900": isUnseenMessage,
                                    })}
                                >
                                    {chatList.traffic_number}
                                </p>
                                <p
                                    className={cn(
                                        "text-nowrap truncate w-full max-w-40 md:max-w-48 font-thin text-left text-gray-500 text-sm",
                                        {
                                            "font-semibold text-gray-700":
                                                isUnseenMessage,
                                        }
                                    )}
                                >
                                    {chatList.last_message?.body}
                                </p>
                                <p className="text-xs text-gray-400 font-thin">
                                    {chatList.last_message &&
                                        formatMessageTime(
                                            chatList.last_message?.created_at
                                        )}
                                </p>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default SidebarChatList;
