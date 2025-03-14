import ChatInput from "@/Components/ChatInput";
import ChatNavbar from "@/Components/ChatNavbar";
import Messages from "@/Components/Messages";
import WelcomeBoard from "@/Components/WelcomeBoard";
import ChatLayout from "@/Layouts/ChatLayout";
import { RootState } from "@/lib/store";
import { setShowForm } from "@/lib/store/conversationFormSlice";
import { Head, usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Messaging = () => {
    const { conversation, messages } = usePage().props;

    const [initialMessages, setInitialMessages] = useState<Message[]>([]);
    const [initialConversation, setInitialConversation] =
        useState<Conversation | null>(null);

    const dispatch = useDispatch();

    const {
        showForm,
        conversation: stateConversation,
        messages: stateMessages,
    } = useSelector((state: RootState) => state.conversationForm);

    useEffect(() => {
        if (stateConversation && stateMessages && showForm) {
            setInitialConversation(stateConversation);
            setInitialMessages(stateMessages.data);
        } else {
            setInitialConversation(conversation);
            setInitialMessages(messages?.data);
        }
    }, [stateConversation, stateMessages, showForm]);

    useEffect(() => {
        if (conversation && messages) {
            setInitialConversation(conversation);
            setInitialMessages(messages?.data);
        }

        dispatch(setShowForm(false));
    }, [conversation, messages]);

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
                        />

                        {(!conversation?.is_blocked || showForm) && (
                            <ChatInput setMessages={setInitialMessages} />
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
