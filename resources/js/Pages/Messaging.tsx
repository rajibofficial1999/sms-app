import ChatInput from "@/Components/ChatInput";
import ChatNavbar from "@/Components/ChatNavbar";
import MessageOptionsDropdown from "@/Components/MessageOptionsDropdown";
import PreviewImage from "@/Components/PreviewImage";
import WelcomeBoard from "@/Components/WelcomeBoard";
import ChatLayout from "@/Layouts/ChatLayout";
import { RootState } from "@/lib/store";
import { setShowForm } from "@/lib/store/addConversationSlice";
import { cn } from "@/lib/utils";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import debounce from "debounce";
import { LoaderCircle } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Messaging = () => {
    const { conversation, messages } = usePage().props;
    const scrollDownRef = useRef<HTMLDivElement | null>(null);
    const scrollUpRef = useRef<HTMLDivElement | null>(null);

    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const [initialConversation, setInitialConversation] =
        useState<Conversation | null>(null);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);
    const [messageIsDelete, setMessageIsDelete] = useState<boolean>(false);

    const dispatch = useDispatch();

    const {
        showForm,
        conversation: stateConversation,
        messages: stateMessages,
    } = useSelector((state: RootState) => state.addConversation);

    const fetchScrollMessages = debounce(async () => {
        setIsLoading(true);

        try {
            const { data } = await axios.post(route("messages.load_more"), {
                conversation: conversation?.id,
                page: page,
            });
            if (data.success) {
                if (data.messages.length > 0) {
                    setPage(page + 1);
                }

                setInitialMessages((prevMessges) => [
                    ...prevMessges,
                    ...data.messages,
                ]);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, 300);

    const handleScrollMessages = async () => {
        const scrollUpEl = scrollUpRef.current;

        if (scrollUpEl) {
            const elementRect = scrollUpEl.getBoundingClientRect();

            const isNearTop = elementRect.top >= 65;

            if (isNearTop && !isLoading && !showForm && !messageIsDelete) {
                await fetchScrollMessages();
            }
        }
    };

    // Formatting timestamp
    const formatTimestamp = (timestamp: string) => {
        return format(timestamp, "HH:mm");
    };

    // Handle conversation change
    useEffect(() => {
        if (stateConversation && stateMessages && showForm) {
            setInitialConversation(stateConversation);
            setInitialMessages(stateMessages);
        } else {
            setInitialConversation(conversation);
            setInitialMessages(messages);
        }
    }, [stateConversation, stateMessages, showForm]);

    useEffect(() => {
        if (conversation && messages && !messageIsDelete) {
            setInitialConversation(conversation);
            setInitialMessages(messages);
        }

        setPage(1);
        dispatch(setShowForm(false));
        setMessageIsDelete(false);
    }, [conversation, messages]);

    useEffect(() => {
        if (scrollDownRef.current && hasNewMessage) {
            scrollDownRef.current.scrollIntoView({ behavior: "instant" });
            setHasNewMessage(false);
        }
    }, [hasNewMessage]);

    return (
        <>
            {(conversation || showForm) && <ChatNavbar />}

            <Head title="Messaging" />

            <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4rem)]">
                {conversation || showForm ? (
                    <>
                        <div
                            id="messages"
                            className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scroll-area"
                            onScroll={handleScrollMessages}
                        >
                            <div ref={scrollDownRef} />

                            {initialMessages &&
                                initialMessages.map((message, index) => {
                                    const isLocalNumber =
                                        message.sender_number !==
                                        initialConversation?.traffic_number;

                                    const isTextMessage = !!message.body;

                                    return (
                                        <div
                                            className="chat-message group"
                                            key={index}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-center",
                                                    {
                                                        "justify-end":
                                                            isLocalNumber,
                                                    }
                                                )}
                                            >
                                                {isLocalNumber && (
                                                    <MessageOptionsDropdown
                                                        isTextMessage={
                                                            isTextMessage
                                                        }
                                                        setMessageIsDelete={
                                                            setMessageIsDelete
                                                        }
                                                        setMessages={
                                                            setInitialMessages
                                                        }
                                                        message={message}
                                                        align="end"
                                                        className="order-1"
                                                    />
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
                                                        <div className="max-w-xs">
                                                            <PreviewImage
                                                                imageUrl={
                                                                    message
                                                                        .image
                                                                        .image_url
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
                                                    <MessageOptionsDropdown
                                                        isTextMessage={
                                                            isTextMessage
                                                        }
                                                        setMessageIsDelete={
                                                            setMessageIsDelete
                                                        }
                                                        setMessages={
                                                            setInitialMessages
                                                        }
                                                        message={message}
                                                        align="start"
                                                        className="order-2"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            <div
                                ref={scrollUpRef}
                                className="w-full flex justify-center items-center"
                            >
                                {isLoading && (
                                    <LoaderCircle className="animate-spin" />
                                )}
                            </div>
                        </div>

                        {(!conversation?.is_blocked || showForm) && (
                            <ChatInput
                                setMessages={setInitialMessages}
                                setHasNewMessage={setHasNewMessage}
                            />
                        )}
                    </>
                ) : (
                    <WelcomeBoard />
                )}
            </div>
        </>
    );
};

Messaging.layout = (page: ReactNode) => <ChatLayout children={page} />;

export default Messaging;
