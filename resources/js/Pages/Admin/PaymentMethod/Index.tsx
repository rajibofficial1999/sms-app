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
import { Head, Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import debounce from "debounce";
import { ToggleRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const headers = [
    "Method Type",
    "Account number",
    "Account Type",
    "Logo",
    "Status",
];

const Orders = () => {
    const { paymentMethods } = usePage().props;
    const [fetchedPaymentMethods, setFetchedPaymentMethods] =
        useState<any>(paymentMethods);

    const handleSearch = debounce(async (query) => {
        try {
            const { data } = await axios.post(
                route("admin.payment-methods.search"),
                {
                    key: query,
                }
            );

            setFetchedPaymentMethods(data.paymentMethods);
        } catch (error) {
            console.error(error);
        }
    }, 300);

    useEffect(() => {
        setFetchedPaymentMethods(paymentMethods);
    }, [paymentMethods]);

    return (
        <>
            <div className="my-5">
                <Head title="Payment methods" />
                <Table
                    isActionRequired={true}
                    headers={headers}
                    data={fetchedPaymentMethods}
                    handleSearch={handleSearch}
                    addItemUrl={route("admin.payment-methods.create")}
                >
                    {fetchedPaymentMethods.data.map((method: PaymentMethod) => (
                        <tr className="border-b" key={method.id}>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap capitalize">
                                {method.type}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {method?.account_number}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {method.account_type}
                            </td>
                            <td className="px-4 py-3 size-10">
                                <img
                                    className="object-contain rounded-md border"
                                    src={`/storage/${method?.logo}`}
                                    alt="payment type logo"
                                />
                            </td>

                            <td className="px-4 py-3 capitalize">
                                <Badge
                                    className={cn({
                                        "bg-green-500 hover:bg-green-500":
                                            method.status,
                                        "bg-yellow-500 hover:bg-yellow-500":
                                            !method.status,
                                    })}
                                >
                                    {method.status ? "Active" : "Inactive"}
                                </Badge>
                            </td>

                            <TableAction
                                item={method}
                                routeName="admin.payment-methods"
                            >
                                <DropdownMenuItem asChild>
                                    <Link
                                        as="button"
                                        method="put"
                                        href={route(
                                            "admin.payment-methods.status",
                                            method.id
                                        )}
                                        className="w-full cursor-pointer"
                                    >
                                        <ToggleRight className="size-4" />{" "}
                                        {method.status
                                            ? "Deactivate"
                                            : "Activate"}
                                    </Link>
                                </DropdownMenuItem>
                            </TableAction>
                        </tr>
                    ))}
                </Table>
            </div>
        </>
    );
};

Orders.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Orders;
