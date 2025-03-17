import Table from "@/Components/Table";
import TableAction from "@/Components/TableAction";
import { Badge } from "@/Components/ui/badge";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { cn } from "@/lib/utils";
import { Head, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import debounce from "debounce";
import { ToggleRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const headers = [
    "Name",
    "Email",
    "Phone number",
    "Subscription status",
    "Subscription end date",
    "Email verified",
    "Status",
];

type Filter = Status | "subscribed" | "unsubscribed" | "all" | null;

const PhoneNumbers = () => {
    const {
        users,
        statuses,
        auth: { admin },
    } = usePage().props;
    const [fetchedUsers, setFetchedUsers] = useState<any>(users);

    const handleSearch = debounce(async (query) => {
        try {
            const { data } = await axios.get(
                route("admin.users.search", {
                    search: query,
                })
            );

            setFetchedUsers(data.users);
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
                route("admin.users.filter", {
                    status: status,
                })
            );
            setFetchedUsers(data.users);
        } catch (error) {
            console.error(error);
        }
    };

    const filters: Filter[] = [
        "all",
        "subscribed",
        "unsubscribed",
        ...statuses,
    ];

    useEffect(() => {
        setFetchedUsers(users);
    }, [users]);

    return (
        <>
            <div className="my-5">
                <Head title="Phone numbers" />
                <Table
                    isActionRequired={true}
                    headers={headers}
                    data={fetchedUsers}
                    handleSearch={handleSearch}
                    filters={filters}
                    handleFilter={handleFilter}
                    searchBy="name"
                    filterBy="subscription"
                >
                    {fetchedUsers.data.map((user: User) => (
                        <tr className="border-b" key={user.id}>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap capitalize">
                                {user.name}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {user.email}
                            </td>

                            <td className="px-4 py-3 capitalize text-nowrap">
                                {user.phone_number
                                    ? user.phone_number.number
                                    : "..."}
                            </td>

                            <td className="px-4 py-3 capitalize">
                                {user.subscription ? (
                                    <SubscriptionStatus
                                        subscription={user.subscription}
                                    />
                                ) : (
                                    "..."
                                )}
                            </td>

                            <td className="px-4 py-3 capitalize">
                                {user.subscription
                                    ? format(
                                          user.subscription.expired_at,
                                          "MMM d, yyyy"
                                      )
                                    : "..."}
                            </td>

                            <td className="px-4 py-3">
                                <p
                                    className={cn({
                                        "text-green-500":
                                            user.email_verified_at,
                                        "text-yellow-500":
                                            !user.email_verified_at,
                                    })}
                                >
                                    {user.email_verified_at
                                        ? "Verified"
                                        : "Unverified"}
                                </p>
                            </td>

                            <td className="px-4 py-3">
                                <Badge
                                    className={cn({
                                        "bg-green-500 hover:bg-green-500":
                                            user.status,
                                        "bg-yellow-500 hover:bg-yellow-500":
                                            !user.status,
                                    })}
                                >
                                    {user.status ? "Active" : "Inactive"}
                                </Badge>
                            </td>

                            <TableAction
                                item={user}
                                routeName="admin.users"
                                showEdit={false}
                                showDelete={
                                    !!admin.can_only.delete_user ||
                                    admin.is_super_admin
                                }
                            >
                                {(admin.is_super_admin ||
                                    admin.can_only.change_user_status) && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            as="button"
                                            method="put"
                                            href={route(
                                                "admin.users.status",
                                                user.id
                                            )}
                                            className="w-full cursor-pointer"
                                        >
                                            <ToggleRight className="size-4" />{" "}
                                            {user.status
                                                ? "Deactivate"
                                                : "Activate"}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </TableAction>
                        </tr>
                    ))}
                </Table>
            </div>
        </>
    );
};

const SubscriptionStatus = ({
    subscription,
}: {
    subscription: Subscription;
}) => {
    return (
        <Badge
            className={cn({
                "bg-green-500 hover:bg-green-500":
                    subscription.status === "completed",
                "bg-yellow-500 hover:bg-yellow-500":
                    subscription.status === "pending",
                "bg-red-500 hover:bg-red-500":
                    subscription.status === "rejected",
                "bg-gray-500 hover:bg-gray-500": subscription.is_expired,
            })}
        >
            {subscription.status === "completed"
                ? subscription.is_expired
                    ? "Expired"
                    : "Active"
                : subscription.status}
        </Badge>
    );
};

PhoneNumbers.layout = (page: ReactNode) => <AppLayout children={page} />;

export default PhoneNumbers;
