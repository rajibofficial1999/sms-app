import ChatInput from "@/Components/ChatInput";
import ChatNavbar from "@/Components/ChatNavbar";
import Messages from "@/Components/Messages";
import WelcomeBoard from "@/Components/WelcomeBoard";
import ChatLayout from "@/Layouts/ChatLayout";
import { pusher } from "@/lib/pusher";
import { Head, usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";

const Messaging = () => {
    const { conversation, messages } = usePage().props;
    const [initialMessages, setInitialMessages] = useState<Message[]>(messages);

    useEffect(() => {
        const channel = pusher.subscribe("chat");

        channel.bind("message.received", function (data: { message: Message }) {
            console.log(conversation?.id, data.message.conversation_id);

            if (
                Number(conversation?.id) ===
                Number(data.message.conversation_id)
            ) {
                setInitialMessages((prev) => [data.message, ...prev]);
            }
        });
    }, []);

    return (
        <>
            {conversation && <ChatNavbar />}

            <Head title="Messaging" />

            <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4rem)]">
                {conversation ? (
                    <>
                        <Messages
                            chatNumber={conversation?.traffic_number as string}
                            messages={initialMessages}
                        />

                        <ChatInput
                            conversation={conversation as Conversation}
                        />
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
