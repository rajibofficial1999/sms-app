import { RootState } from "@/lib/store";
import { cn, formatMessageTime } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { Ban, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SidebarChatList = () => {
    const { conversation, chatLists } = usePage().props;

    const [initialChatLists, setInitialChatLists] = useState<ChatList[]>([]);

    const { message } = useSelector((state: RootState) => state.message);

    useEffect(() => {
        setInitialChatLists(chatLists);
    }, [chatLists]);

    useEffect(() => {
        if (message) {
            setInitialChatLists((prevChatLists) => {
                const updatedChatLists = prevChatLists.map((chatList) => {
                    if (chatList.id === message.conversation_id) {
                        return {
                            ...chatList,
                            last_message_body: message.body,
                            last_message_time: message.created_at,
                            last_message_image: message.image.image_url,
                        };
                    }
                    return chatList;
                });

                return [...updatedChatLists].sort(
                    (a, b) =>
                        new Date(b.last_message_time as string).getTime() -
                        new Date(a.last_message_time as string).getTime()
                );
            });
        }
    }, [message]);

    return (
        <ul className="">
            {initialChatLists.map((chatList) => (
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
                        <div className="flex justify-between items-center w-full">
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
                                {
                                    <p
                                        className={cn(
                                            "text-nowrap truncate w-full max-w-40 md:max-w-48 font-thin text-left text-gray-500 text-sm",
                                            {
                                                "font-semibold text-gray-700":
                                                    chatList.unread_messages_count >
                                                    0,
                                            }
                                        )}
                                    >
                                        {chatList.last_message_body ?? "..."}
                                    </p>
                                }
                                <p className="text-xs text-gray-400 font-thin">
                                    {chatList.last_message_time &&
                                        formatMessageTime(
                                            chatList.last_message_time
                                        )}
                                </p>
                            </div>
                            {chatList.last_message_image && (
                                <div className="size-10 border">
                                    <img
                                        className="rounded-md object-cover w-full h-full"
                                        src={chatList.last_message_image}
                                        alt="image"
                                    />
                                </div>
                            )}
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default SidebarChatList;
