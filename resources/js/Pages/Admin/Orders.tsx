import Table from "@/Components/Table";
import TableAction from "@/Components/TableAction";
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
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, ReactNode, useEffect, useState } from "react";
import debounce from "debounce";
import axios from "axios";
import { toast } from "sonner";
import Modal from "@/Components/Modal";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { LoaderCircle } from "lucide-react";
import PreviewImage from "@/Components/PreviewImage";

const headers = [
    "Holder Name",
    "Period",
    "Payment Method",
    "Area Code",
    "Renewal Number",
    "User Name",
    "Payment Screenshot",
    "Status",
];

type Filter = Status | "all" | null;

interface OrderForOrderPage extends Order {
    payment_method_name: string;
    user_name: string;
    user_renewal_number: string | null;
}

const Orders = () => {
    const {
        orders,
        statuses,
        auth: { admin },
    } = usePage().props;
    const [fetchedOrders, setFetchedOrders] = useState<any>(orders);
    const [show, setShowModal] = useState<boolean>(false);
    const [approvalOrder, setApprovalOrder] = useState<Order | null>(null);

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
            const { data } = await axios.get(
                route("admin.orders.search", { search: query })
            );

            setFetchedOrders(data.orders);
        } catch (error) {
            console.error(error);
        }
    }, 300);

    const handleFilter = async (status: Filter) => {
        if (status === "all") {
            status = null;
        }
        try {
            const { data } = await axios.get(
                route("admin.orders.filter", {
                    status: status,
                })
            );

            setFetchedOrders(data.orders);
        } catch (error) {
            console.error(error);
        }
    };

    const { put, data, setData, errors, processing, reset } = useForm({
        number: "",
    });

    const closeModal = () => {
        setShowModal(false);
        setApprovalOrder(null);
        reset();
    };

    const handleAddPhoneNumber: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("admin.orders.approve", approvalOrder?.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const handleApprove = (order: Order) => {
        if (order.is_renewal) {
            handleStatusChange(order, "completed");
        } else {
            setApprovalOrder(order);
            setShowModal(true);
        }
    };

    const filters: Filter[] = ["all", ...statuses];

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
                    searchBy="user name"
                    filterBy="status"
                >
                    {fetchedOrders.data.map((order: OrderForOrderPage) => (
                        <tr className="border-b" key={order.id}>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                {order.account_holder_name}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order.period}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order?.payment_method_name}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order.area_code
                                    ? String(order.area_code)
                                    : "..."}
                            </td>
                            <td className="px-4 py-3">
                                {order.is_renewal
                                    ? order.user_renewal_number
                                    : "..."}
                            </td>
                            <td className="px-4 py-3">{order.user_name}</td>
                            <td className="px-4 py-3 size-10">
                                <PreviewImage
                                    imageUrl={`/storage/${order.payment_screenshot}`}
                                    imageAlt="Payment Screenshot"
                                    className="rounded-md border"
                                />
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {order.status !== "pending" ? (
                                    <Badge
                                        className={cn({
                                            "bg-green-500 hover:bg-green-500":
                                                (order.status as Status) ===
                                                "completed",
                                            "bg-red-500 hover:bg-red-500":
                                                (order.status as Status) ===
                                                "rejected",
                                        })}
                                    >
                                        {order.status}
                                    </Badge>
                                ) : admin.is_super_admin ||
                                  admin.can_only.change_order_status ? (
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
                                                        handleApprove(order)
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
                                                    Reject
                                                </button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Badge
                                        className={cn({
                                            "bg-green-500 hover:bg-green-500":
                                                (order.status as Status) ===
                                                "completed",
                                            "bg-red-500 hover:bg-red-500":
                                                (order.status as Status) ===
                                                "rejected",
                                            "bg-yellow-500 hover:bg-yellow-500":
                                                (order.status as Status) ===
                                                "pending",
                                        })}
                                    >
                                        {order.status}
                                    </Badge>
                                )}
                            </td>

                            <TableAction
                                item={order}
                                routeName="admin.orders"
                                showEdit={false}
                                showDelete={
                                    !!admin.can_only.delete_order ||
                                    admin.is_super_admin
                                }
                            />
                        </tr>
                    ))}
                </Table>
            </div>

            <Modal isOpen={show} setIsOpen={setShowModal} onClose={closeModal}>
                <h1 className="text-center text-lg font-semibold">
                    Provide a phone number
                </h1>
                <form onSubmit={handleAddPhoneNumber}>
                    <Label htmlFor="phone">Phone</Label>

                    <Input
                        id="phone"
                        type="text"
                        name="phone"
                        className="mt-1 w-full"
                        placeholder="+1 (555) 555-5555"
                        value={data.number}
                        onChange={(e) => setData("number", e.target.value)}
                    />

                    <InputError message={errors.number} className="mt-2" />

                    <div className="mt-6 flex justify-end">
                        <Button
                            className="flex items-center"
                            disabled={processing}
                        >
                            {processing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            <span>Submit</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

Orders.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Orders;
