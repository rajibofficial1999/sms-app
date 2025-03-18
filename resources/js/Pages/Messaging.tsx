import ChatInput from "@/Components/ChatInput";
import ChatNavbar from "@/Components/ChatNavbar";
import Messages from "@/Components/Messages";
import WelcomeBoard from "@/Components/WelcomeBoard";
import ChatLayout from "@/Layouts/ChatLayout";
import { RootState } from "@/lib/store";
import { setShowForm } from "@/lib/store/conversationFormSlice";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import debounce from "debounce";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Messaging = () => {
    const { conversation, messages } = usePage().props;

    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const [initialConversation, setInitialConversation] =
        useState<Conversation | null>(null);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);
    const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

    const dispatch = useDispatch();

    const {
        showForm,
        conversation: stateConversation,
        messages: stateMessages,
    } = useSelector((state: RootState) => state.conversationForm);

    const fetchScrollMessages = debounce(async () => {
        setIsLoading(true);

        try {
            const { data } = await axios.post(route("messages.load_more"), {
                conversation: conversation?.id,
                page: page,
            });
            if (data.success) {
                setPage(page + 1);

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
        if (conversation && messages) {
            setInitialConversation(conversation);
            setInitialMessages(messages);
        }

        dispatch(setShowForm(false));
    }, [conversation, messages]);

    useEffect(() => {
        if (scrollDownRef.current && hasNewMessage) {
            scrollDownRef.current.scrollIntoView({ behavior: "smooth" });
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
                        <Messages
                            conversation={initialConversation}
                            messages={initialMessages}
                            fetchScrollMessages={fetchScrollMessages}
                            isLoading={isLoading}
                            scrollDownRef={scrollDownRef}
                        />

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
