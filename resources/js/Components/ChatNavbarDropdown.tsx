import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import {
    Ban,
    EllipsisVertical,
    Shield,
    ShieldBan,
    TrashIcon,
} from "lucide-react";

interface ChatNavbarDropdownProps {
    conversation: Conversation | null;
}

const ChatNavbarDropdown: React.FC<ChatNavbarDropdownProps> = ({
    conversation,
}) => {
    return (
        <Menu>
            <MenuButton>
                <EllipsisVertical className="size-5 text-gray-600" />
            </MenuButton>

            <MenuItems
                transition
                anchor="bottom end"
                className="w-52 origin-top-right rounded-xl border bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 shadow-sm"
            >
                <MenuItem>
                    <Link
                        href={route("conversations.destroy", conversation?.id)}
                        method="delete"
                        as="button"
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100"
                    >
                        <TrashIcon className="size-4 " />
                        Delete
                    </Link>
                </MenuItem>
                <MenuItem>
                    {conversation?.is_blocked ? (
                        <Link
                            href={route(
                                "conversations.unblock",
                                conversation?.id
                            )}
                            method="post"
                            as="button"
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100"
                        >
                            <ShieldBan className="size-4 " />
                            Unblock
                        </Link>
                    ) : (
                        <Link
                            href={route(
                                "conversations.block",
                                conversation?.id
                            )}
                            method="post"
                            as="button"
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100"
                        >
                            <Shield className="size-4 " />
                            Block
                        </Link>
                    )}
                </MenuItem>
                {!conversation?.is_blocked && (
                    <MenuItem>
                        <Link
                            href={route(
                                "conversations.block_destroy",
                                conversation?.id
                            )}
                            method="post"
                            as="button"
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100 text-red-500"
                        >
                            <Ban className="size-4 " />
                            Block and delete
                        </Link>
                    </MenuItem>
                )}
            </MenuItems>
        </Menu>
    );
};

export default ChatNavbarDropdown;
