import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FC, useRef } from "react";

interface MessagesProps {
    messages: Message[];
    conversation: Conversation | null;
}

const Messages: FC<MessagesProps> = ({ messages, conversation }) => {
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    const formatTimestamp = (timestamp: string) => {
        return format(timestamp, "HH:mm");
    };

    return (
        <div
            id="messages"
            className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
            <div ref={scrollDownRef} />

            {messages &&
                messages.map((message) => {
                    const isLocalNumber =
                        message.sender_number !== conversation?.traffic_number;

                    const isTextMessage = !!message.body;

                    return (
                        <div className="chat-message" key={message.id}>
                            <div
                                className={cn("flex items-end", {
                                    "justify-end": isLocalNumber,
                                })}
                            >
                                <div
                                    className={cn(
                                        "flex flex-col space-y-2 text-base max-w-xs mx-2",
                                        {
                                            "order-1 items-end": isLocalNumber,
                                            "order-2 items-start":
                                                !isLocalNumber,
                                        }
                                    )}
                                >
                                    {isTextMessage ? (
                                        <span
                                            className={cn(
                                                "px-4 py-2 rounded-lg inline-block",
                                                {
                                                    "bg-indigo-600 text-white":
                                                        isLocalNumber,
                                                    "bg-gray-200 text-gray-900":
                                                        !isLocalNumber,
                                                    "rounded-br-none":
                                                        isLocalNumber,
                                                    "rounded-bl-none":
                                                        !isLocalNumber,
                                                }
                                            )}
                                        >
                                            {message.body}{" "}
                                            <span className="ml-2 text-xs text-gray-400">
                                                {formatTimestamp(
                                                    message.created_at
                                                )}
                                            </span>
                                        </span>
                                    ) : (
                                        <div>
                                            <img
                                                src={
                                                    isLocalNumber
                                                        ? `/storage/${message.image.image_url}`
                                                        : message.image
                                                              .image_url
                                                }
                                                alt="image"
                                                className="rounded-md cursor-pointer"
                                            />
                                            <span className="ml-2 text-xs text-gray-400">
                                                {formatTimestamp(
                                                    message.created_at
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={cn("relative w-6 h-6", {
                                        "order-2": isLocalNumber,
                                        "order-1": !isLocalNumber,
                                    })}
                                ></div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default Messages;
