import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { Copy, Download, EllipsisVertical, TrashIcon } from "lucide-react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";
import { saveAs } from "file-saver";

interface MessageOptionsDropdownProps {
    className?: string;
    align: "start" | "end";
    isTextMessage: boolean;
    message: Message;
    setMessageIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageOptionsDropdown = ({
    className,
    align,
    isTextMessage,
    message,
    setMessageIsDelete,
    setMessages,
}: MessageOptionsDropdownProps) => {
    const handleDeleteMessage = async (message: Message) => {
        router.delete(route("messages.destroy", message.id), {
            preserveScroll: true,
            onSuccess: () => {
                setMessages((prevMessges) =>
                    prevMessges.filter((mess) => mess.id !== message.id)
                );
                setMessageIsDelete(true);
                toast("Message deleted successfully");
            },
        });
    };

    const downloadImage = async (imageUrl: string) => {
        let extension = imageUrl.split(".").pop();
        let fileName = `download.${extension}`;

        const response = await fetch(imageUrl);
        const blob = await response.blob();
        saveAs(blob, fileName);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <EllipsisVertical
                    className={cn(
                        "size-5 invisible group-hover:visible transition-all cursor-pointer",
                        className
                    )}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent align={align} className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                    {isTextMessage ? (
                        <CopyToClipboard
                            text={message.body}
                            onCopy={() => toast("Copied to clipboard")}
                        >
                            <button className="w-full flex items-center gap-2">
                                <Copy className="size-4" />
                                <span>Copy text</span>
                            </button>
                        </CopyToClipboard>
                    ) : (
                        <button
                            onClick={() =>
                                downloadImage(message.image.image_url)
                            }
                            className="w-full flex items-center gap-2"
                        >
                            <Download className="size-4" />
                            <span>Download</span>
                        </button>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                    <button
                        onClick={() => handleDeleteMessage(message)}
                        className="w-full text-red-500 hover:!text-red-600"
                    >
                        <TrashIcon className="size-4 " />
                        <span>Delete</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MessageOptionsDropdown;
