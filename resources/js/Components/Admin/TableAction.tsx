import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, router } from "@inertiajs/react";
import { Ellipsis, SquarePen, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface TableActionProps {
    item: any;
    routeName: string;
    showDelete?: boolean;
    showEdit?: boolean;
}

const TableAction: React.FC<TableActionProps> = ({
    item,
    routeName,
    showDelete = true,
    showEdit = true,
}) => {
    const handleDelete = () => {
        router.delete(route(`${routeName}.destroy`, item.id), {
            preserveScroll: true,
            onSuccess: () => toast("Order deleted successfully"),
        });
    };
    return (
        <td className="px-4 py-3 text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Ellipsis className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {showEdit && (
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(`${routeName}.edit`, { item })}
                                className="cursor-pointer"
                            >
                                <SquarePen className="size-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {showDelete && (
                        <DropdownMenuItem asChild>
                            <button
                                onClick={handleDelete}
                                className="w-full cursor-pointer text-red-500 hover:!text-red-600"
                            >
                                <Trash className="size-4" /> Delete
                            </button>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </td>
    );
};

export default TableAction;
