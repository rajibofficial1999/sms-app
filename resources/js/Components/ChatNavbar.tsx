import { RootState } from "@/lib/store";
import {
    setConversation,
    setMessages,
    setShowForm,
    setTrafficNumber,
} from "@/lib/store/conversationFormSlice";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Ban, Phone, UserRound, X } from "lucide-react";
import { FC, FocusEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatNavbarDropdown from "./ChatNavbarDropdown";
import { Input } from "./ui/input";

interface ChatNavbarProps {
    className?: string;
}

const ChatNavbar: FC<ChatNavbarProps> = ({ className }) => {
    const { showForm } = useSelector(
        (state: RootState) => state.conversationForm
    );

    const { conversation } = usePage().props;
    const dispatch = useDispatch();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputBlur = async (e: FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            dispatch(setTrafficNumber(null));
            dispatch(setShowForm(false));

            return;
        }

        try {
            const { data } = await axios.get(`/api/messages/${e.target.value}`);
            if (data.success) {
                dispatch(setMessages(data.messages));
                dispatch(setConversation(data.conversation));
            }

            dispatch(setTrafficNumber(e.target.value));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (inputRef.current && showForm) {
            inputRef.current.focus();
        }
    }, [showForm]);

    return (
        <div
            className={cn(
                "py-3 px-4 bg-zinc-50 border-b h-14 border-zinc-200 flex items-center justify-between relative",
                className
            )}
        >
            {conversation && !showForm && (
                <>
                    <div className="flex items-center gap-x-1">
                        <div
                            className={cn(
                                "size-8 rounded-full flex-shrink-0 relative flex justify-center items-center text-white",
                                {
                                    "!bg-red-500": conversation.is_blocked,
                                }
                            )}
                            style={{
                                backgroundColor: conversation.avatar_color,
                            }}
                        >
                            {conversation.is_blocked ? (
                                <Ban className="size-4" />
                            ) : (
                                <UserRound className="size-4" />
                            )}
                        </div>
                        <p className="font-semibold text-gray-600">
                            {conversation?.traffic_number}
                        </p>
                    </div>
                    <ChatNavbarDropdown conversation={conversation} />
                </>
            )}

            {showForm && (
                <>
                    <div className="flex items-center gap-x-1 w-full max-w-sm relative">
                        <Input
                            className="w-full bg-white pl-8"
                            placeholder="+1 (555) 555-5555"
                            ref={inputRef}
                            onBlur={handleInputBlur}
                        />
                        <Phone className="size-4 text-gray-600 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                        onClick={() => {
                            dispatch(setTrafficNumber(null));
                            dispatch(setShowForm(false));
                            dispatch(setConversation(null));
                            dispatch(setMessages(null));
                        }}
                    >
                        <X className="size-5 text-gray-600" />
                    </button>
                </>
            )}
        </div>
    );
};

export default ChatNavbar;
