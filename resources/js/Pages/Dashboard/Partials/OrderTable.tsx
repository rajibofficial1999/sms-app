import Modal from "@/Components/Modal";
import PreviewImage from "@/Components/PreviewImage";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { cn } from "@/lib/utils";
import { router, usePage } from "@inertiajs/react";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderForDashboard extends Order {
    payment_method_name: string;
    user_name: string;
    user_renewal_number: string | null;
}

const OrderTable = () => {
    const { orders } = usePage().props;
    const [deleteableOrderId, setDeleteableOrderId] = useState<number | null>(
        null
    );
    const [showModal, setShowModal] = useState<boolean>(false);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const confirmDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!deleteableOrderId) {
            return;
        }

        setIsProcessing(true);

        router.delete(route(`orders.destroy`, deleteableOrderId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setShowModal(false);

                toast("Order deleted successfully");
            },
        });
    };
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-nowrap">
                                        Period
                                    </TableHead>
                                    <TableHead className="text-nowrap">
                                        Payment Method
                                    </TableHead>
                                    <TableHead className="text-nowrap">
                                        Area Code
                                    </TableHead>
                                    <TableHead className="text-nowrap">
                                        Renewal Number
                                    </TableHead>
                                    <TableHead className="text-nowrap">
                                        Payment Screenshot
                                    </TableHead>
                                    <TableHead className="text-nowrap">
                                        Status
                                    </TableHead>
                                    <TableHead className="sr-only">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.map((order: OrderForDashboard) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium capitalize">
                                            {order.period}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {order.payment_method_name}
                                        </TableCell>
                                        <TableCell>
                                            {order.area_code
                                                ? String(order.area_code)
                                                : "..."}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-nowrap">
                                                {order.user_renewal_number
                                                    ? order.user_renewal_number
                                                    : "..."}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="size-10 flex items-center">
                                                <PreviewImage
                                                    imageUrl={`/storage/${order.payment_screenshot}`}
                                                    imageAlt="Payment Screenshot"
                                                    className="rounded-md border"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge
                                                className={cn({
                                                    "bg-green-500 hover:bg-green-500":
                                                        order?.status ===
                                                        "completed",
                                                    "bg-red-500 hover:bg-red-500":
                                                        order?.status ===
                                                        "rejected",
                                                    "bg-yellow-500 hover:bg-yellow-500":
                                                        order?.status ===
                                                        "pending",
                                                })}
                                            >
                                                {order?.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {order.status !== "completed" && (
                                                <button
                                                    onClick={() => {
                                                        setDeleteableOrderId(
                                                            order.id
                                                        );
                                                        setShowModal(true);
                                                    }}
                                                    className="text-red-500"
                                                >
                                                    <TrashIcon className="size-4" />
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
            <Modal isOpen={showModal} setIsOpen={setShowModal}>
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
                            onClick={() => setShowModal(false)}
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

export default OrderTable;
