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

const filters: Status[] = ["pending", "completed", "rejected"];

const Orders = () => {
    const { orders } = usePage().props;
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

    const { put, data, setData, errors, processing, reset } = useForm({
        phone: "",
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
                            <td className="px-4 py-3 capitalize">
                                {order.area_code ? (
                                    <Badge className="text-nowrap">
                                        {String(order.area_code)}
                                    </Badge>
                                ) : (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-500">
                                        N/A
                                    </Badge>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                {order.is_renewal ? (
                                    <Badge>
                                        {order?.user?.phone_number?.number}
                                    </Badge>
                                ) : (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-500">
                                        N/A
                                    </Badge>
                                )}
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
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                    />

                    <InputError message={errors.phone} className="mt-2" />

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
