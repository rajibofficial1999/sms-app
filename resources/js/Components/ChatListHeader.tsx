import { setShowForm } from "@/lib/store/addConversationSlice";
import { cn } from "@/lib/utils";
import { UserPlus2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";

interface ChatListHeaderProps {
    className?: string;
}

const ChatListHeader: React.FC<ChatListHeaderProps> = ({ className }) => {
    const dispatch = useDispatch();

    return (
        <>
            <div
                className={cn(
                    "flex justify-between items-center px-4 gap-2",
                    className
                )}
            >
                <div className="w-full">
                    <p className="text-xs font-semibold leading-6 text-gray-400">
                        Your chats
                    </p>
                </div>

                <Button
                    onClick={() => dispatch(setShowForm(true))}
                    variant="ghost"
                    size="icon"
                >
                    <UserPlus2 />
                </Button>
            </div>
        </>
    );
};

export default ChatListHeader;
