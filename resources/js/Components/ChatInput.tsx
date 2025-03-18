import { RootState } from "@/lib/store";
import { setMessages } from "@/lib/store/conversationFormSlice";
import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import { Image, LoaderCircle, SendHorizonal, Smile } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import Modal from "./Modal";
import { Button, buttonVariants } from "./ui/button";
import { Label } from "./ui/label";

interface ChatInputProps {
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setHasNewMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInput: React.FC<ChatInputProps> = ({
    setMessages,
    setHasNewMessage,
}) => {
    const { conversation } = usePage().props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { trafficNumber, conversation: stateConversation } = useSelector(
        (state: RootState) => state.conversationForm
    );

    const [input, setInput] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<{ SMS: boolean; MMS: boolean }>({
        SMS: false,
        MMS: false,
    });
    const [newTrafficNumber, setNewTrafficNumber] = useState<string | null>(
        null
    );

    const resetForm = () => {
        setInput("");
        setIsModalOpen(false);
        textareaRef.current?.focus();
    };

    const sendMessage = async (type: "MMS" | "SMS") => {
        if ((type === "SMS" && !input.trim()) || (type === "MMS" && !image))
            return;

        setLoading((prev) => ({ ...prev, [type]: true }));

        let receiverNumber = conversation?.traffic_number;
        let conversationId = conversation?.id || "";

        if (newTrafficNumber && !stateConversation) {
            receiverNumber = newTrafficNumber;
            conversationId = "";
        } else if (newTrafficNumber && stateConversation) {
            receiverNumber = stateConversation.traffic_number;
            conversationId = stateConversation.id;
        }

        const formData = new FormData();
        formData.append("body", input);
        formData.append("conversation", String(conversationId));
        formData.append("receiver_number", receiverNumber ?? "");

        if (type === "MMS" && image) formData.append("image", image);

        try {
            const { data } = await axios.post("/api/messages", formData, {
                withCredentials: true,
            });

            if (data.success) {
                resetForm();

                if (newTrafficNumber) {
                    router.get(
                        route("messages.show", data.message.conversation_id)
                    );
                } else {
                    setMessages((prevMessges) => [
                        data.message,
                        ...prevMessges,
                    ]);

                    setHasNewMessage(true);
                }
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading((prev) => ({ ...prev, [type]: false }));
        }
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setPreviewImageUrl(reader.result as string);
            reader.readAsDataURL(file);
            setImage(file);
            setIsModalOpen(true);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage("SMS");
        }
    };

    const handleCloseModal = () => {
        setPreviewImageUrl(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    useEffect(() => {
        setNewTrafficNumber(trafficNumber);
    }, [trafficNumber]);

    return (
        <>
            {/* Image Preview Modal */}
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                onClose={handleCloseModal}
            >
                <div className="flex flex-col items-center gap-2 p-4">
                    {previewImageUrl && (
                        <img
                            src={previewImageUrl}
                            alt="Preview"
                            className="rounded-md border"
                        />
                    )}
                    <Button
                        className="rounded-full size-10 mt-2"
                        onClick={() => sendMessage("MMS")}
                        disabled={loading.MMS}
                    >
                        {loading.MMS ? (
                            <LoaderCircle className="animate-spin size-6" />
                        ) : (
                            <SendHorizonal className="size-6" />
                        )}
                    </Button>
                    <p className="text-gray-700">Send</p>
                </div>
            </Modal>

            {/* Chat Input */}
            <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0 h-20 flex items-center">
                <div className="flex-1">
                    <div className="w-full rounded-lg shadow-sm ring-1 ring-gray-300 focus-within:ring-indigo-600">
                        <TextareaAutosize
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message"
                            rows={2}
                            maxRows={2}
                            className="w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pl-3">
                    <Button
                        variant="ghost"
                        onClick={() => textareaRef.current?.focus()}
                        className="size-9"
                    >
                        <Smile className="!size-5 text-gray-600 hover:text-primary" />
                    </Button>

                    {input ? (
                        <Button
                            onClick={() => sendMessage("SMS")}
                            disabled={loading.SMS}
                            className="rounded-full size-9"
                        >
                            {loading.SMS ? (
                                <LoaderCircle className="animate-spin size-5" />
                            ) : (
                                <SendHorizonal className="size-5" />
                            )}
                        </Button>
                    ) : (
                        <Label
                            htmlFor="image"
                            className={buttonVariants({
                                variant: "ghost",
                                className: "cursor-pointer size-9",
                            })}
                        >
                            <Image className="!size-5 text-gray-600 hover:text-primary" />
                            <input
                                ref={imageInputRef}
                                id="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </Label>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatInput;
