import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EllipsisVertical, LoaderCircle, TrashIcon } from "lucide-react";
import { FC, useRef, useState } from "react";
import PreviewImage from "./PreviewImage";
import { Button } from "./ui/button";

interface MessagesProps {
    messages: Message[];
    conversation: Conversation | null;
    fetchScrollMessages: () => void;
    isLoading: boolean;
    scrollDownRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Messages: FC<MessagesProps> = ({
    messages,
    conversation,
    fetchScrollMessages,
    isLoading,
    scrollDownRef,
}) => {
    const scrollUpRef = useRef<HTMLDivElement | null>(null);
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const formatTimestamp = (timestamp: string) => {
        return format(timestamp, "HH:mm");
    };

    const handleScrollMessages = async () => {
        const scrollUpEl = scrollUpRef.current;

        if (scrollUpEl) {
            const elementRect = scrollUpEl.getBoundingClientRect();

            const isNearTop = elementRect.top >= 65;

            if (isNearTop && !isLoading) {
                fetchScrollMessages();
            }
        }
    };

    return (
        <>
            <div
                id="messages"
                className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scroll-area"
                onScroll={handleScrollMessages}
            >
                <div ref={scrollDownRef} />

                {messages &&
                    messages.map((message, index) => {
                        const isLocalNumber =
                            message.sender_number !==
                            conversation?.traffic_number;

                        const isTextMessage = !!message.body;

                        return (
                            <div className="chat-message group" key={index}>
                                <div
                                    className={cn("flex items-center", {
                                        "justify-end": isLocalNumber,
                                    })}
                                >
                                    {isLocalNumber && (
                                        <button
                                            onClick={() => {
                                                setShowMenu(true);
                                            }}
                                            className="order-1 duration-300 hidden group-hover:flex"
                                        >
                                            <EllipsisVertical className="h-4 w-4" />
                                        </button>
                                    )}

                                    <div
                                        className={cn(
                                            "flex flex-col space-y-2 text-base max-w-xs lg:max-w-lg mx-2",
                                            {
                                                "order-1 items-end":
                                                    isLocalNumber,
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
                                                        "bg-primary text-white":
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
                                                <PreviewImage
                                                    imageUrl={
                                                        message.image.image_url
                                                    }
                                                    imageAlt="image"
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

                                    {!isLocalNumber && (
                                        <button
                                            onClick={() => {
                                                setShowMenu(true);
                                            }}
                                            className="order-2 duration-300 hidden group-hover:flex"
                                        >
                                            <EllipsisVertical className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                <div
                    ref={scrollUpRef}
                    className="w-full flex justify-center items-center"
                >
                    {isLoading && <LoaderCircle className="animate-spin" />}
                </div>
            </div>
            <DropdownMenu open={showMenu}>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default Messages;
