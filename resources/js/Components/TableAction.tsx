import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, router } from "@inertiajs/react";
import { Ellipsis, LoaderCircle, SquarePen, Trash } from "lucide-react";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Modal from "./Modal";

interface TableActionProps {
    item: any;
    routeName: string;
    showDelete?: boolean;
    showEdit?: boolean;
    children?: ReactNode;
}

const TableAction: React.FC<TableActionProps> = ({
    item,
    routeName,
    showDelete = true,
    showEdit = true,
    children,
}) => {
    const [confirmingDeletion, setConfirmingDeletion] =
        useState<boolean>(false);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const confirmDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsProcessing(true);

        router.delete(route(`${routeName}.destroy`, item.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setConfirmingDeletion(false);
                toast("Order deleted successfully");
            },
        });
    };

    return (
        <>
            <td className="px-4 py-3 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Ellipsis className="size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {children}
                        {showEdit && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(`${routeName}.edit`, item.id)}
                                    className="cursor-pointer"
                                >
                                    <SquarePen className="size-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {showDelete && (
                            <DropdownMenuItem asChild>
                                <button
                                    onClick={() => setConfirmingDeletion(true)}
                                    className="w-full cursor-pointer text-red-500 hover:!text-red-600"
                                >
                                    <Trash className="size-4" /> Delete
                                </button>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>

            <Modal
                isOpen={confirmingDeletion}
                setIsOpen={setConfirmingDeletion}
            >
                <form onSubmit={confirmDelete}>
                    <h2 className="text-lg font-medium text-gray-900 text-center">
                        Are you sure you want to delete?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 text-center">
                        Once deleted, all of its resources and data will be
                        permanently deleted.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmingDeletion(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="destructive"
                            className="ms-3 flex items-center"
                            disabled={isProcessing}
                        >
                            {isProcessing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            <span>Delete</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default TableAction;
