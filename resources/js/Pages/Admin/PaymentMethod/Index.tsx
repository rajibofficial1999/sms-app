import Table from "@/Components/Table";
import TableAction from "@/Components/TableAction";
import { Badge } from "@/Components/ui/badge";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { cn } from "@/lib/utils";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import debounce from "debounce";
import { ToggleRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const headers = [
    "Method name",
    "Account number",
    "Account Type",
    "Logo",
    "Status",
];

const PaymentMethods = () => {
    const { paymentMethods } = usePage().props;
    const [fetchedPaymentMethods, setFetchedPaymentMethods] =
        useState<any>(paymentMethods);

    const handleSearch = debounce(async (query) => {
        try {
            const { data } = await axios.get(
                route("admin.payment-methods.search", { search: query })
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
                    searchBy="name"
                    addButton={{
                        url: route("admin.payment-methods.create"),
                        text: "Add payment method",
                    }}
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

PaymentMethods.layout = (page: ReactNode) => <AppLayout children={page} />;

export default PaymentMethods;
