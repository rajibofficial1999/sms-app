import Table from "@/Components/Admin/Table";
import TableAction from "@/Components/Admin/TableAction";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { cn } from "@/lib/utils";
import { Head, router, usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import debounce from "debounce";
import axios from "axios";
import { toast } from "sonner";

const headers = [
    "Holder Name",
    "Period",
    "Payment Method",
    "User Name",
    "Payment Screenshot",
    "Status",
];

const filters: Status[] = ["pending", "completed", "rejected"];

const Orders = () => {
    const { orders } = usePage().props;
    const [fetchedOrders, setFetchedOrders] = useState<any>(orders);

    const handleStatusChange = (order: Order, status: Status) => {
        router.put(
            route("admin.orders.update", order.id),
            {
                status: status,
            },
            {
                onSuccess: () => toast("Order status updated successfully"),
            }
        );
    };

    const handleSearch = debounce(async (query) => {
        try {
            const { data } = await axios.post(route("admin.orders.search"), {
                key: query,
            });

            setFetchedOrders(data.orders);
        } catch (error) {
            console.error(error);
        }
    }, 300);

    const handleFilter = async (status: Status) => {
        try {
            const { data } = await axios.post(route("admin.orders.filter"), {
                status: status,
            });

            setFetchedOrders(data.orders);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setFetchedOrders(orders);
    }, [orders]);

    return (
        <>
            <div className="my-5">
                <Head title="Orders" />
                <Table
                    isActionRequired={true}
                    headers={headers}
                    data={fetchedOrders}
                    filters={filters}
                    handleSearch={handleSearch}
                    handleFilter={handleFilter}
                >
                    {fetchedOrders.data.map((order: Order) => (
                        <tr className="border-b" key={order.id}>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                {order?.account_holder_name}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order?.period}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order?.payment_method?.type}
                            </td>
                            <td className="px-4 py-3">{order?.user?.name}</td>
                            <td className="px-4 py-3 size-10">
                                <img
                                    className=" object-contain rounded-md cursor-pointer border"
                                    src={`/storage/${order?.payment_screenshot}`}
                                    alt="Payment Screenshot"
                                />
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order?.status !== "pending" ? (
                                    <Badge
                                        className={cn({
                                            "bg-green-500 hover:bg-green-500":
                                                order?.status === "completed",
                                            "bg-red-500 hover:bg-red-500":
                                                order?.status === "rejected",
                                        })}
                                    >
                                        {order?.status}
                                    </Badge>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                Option
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem asChild>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            order,
                                                            "completed"
                                                        )
                                                    }
                                                    className="cursor-pointer w-full"
                                                >
                                                    Approve
                                                </button>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            order,
                                                            "rejected"
                                                        )
                                                    }
                                                    className="cursor-pointer w-full text-red-500 hover:!text-red-600"
                                                >
                                                    Rejected
                                                </button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </td>

                            <TableAction
                                item={order}
                                routeName="admin.orders"
                                showEdit={false}
                            />
                        </tr>
                    ))}
                </Table>
            </div>
        </>
    );
};

Orders.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Orders;
