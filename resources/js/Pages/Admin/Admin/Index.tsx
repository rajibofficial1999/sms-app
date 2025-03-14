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
    "Name",
    "Email",
    "Profile picture",
    "Roles",
    "Email verified",
    "Status",
];

const PhoneNumbers = () => {
    const { admins, role_names } = usePage().props;

    const [fetchedAdminUsers, setFetchedAdminUsers] = useState<any>(admins);

    const handleSearch = debounce(async (query) => {
        try {
            const { data } = await axios.get(
                route("admin.admin-users.search", {
                    search: query,
                })
            );

            setFetchedAdminUsers(data.adminUsers);
        } catch (error) {
            console.error(error);
        }
    }, 300);

    const handleFilter = async (roleName: string | null) => {
        if (roleName === "all") {
            roleName = null;
        }

        try {
            const { data } = await axios.get(
                route("admin.admin-users.filter", {
                    role_name: roleName,
                })
            );
            setFetchedAdminUsers(data.adminUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const filters = ["all", ...role_names];

    useEffect(() => {
        setFetchedAdminUsers(admins);
    }, [admins]);

    return (
        <>
            <div className="my-5">
                <Head title="Phone numbers" />
                <Table
                    isActionRequired={true}
                    headers={headers}
                    data={fetchedAdminUsers}
                    handleSearch={handleSearch}
                    filters={filters}
                    handleFilter={handleFilter}
                    searchBy="name"
                    filterBy="role"
                    addButton={{
                        url: route("admin.admin-users.create"),
                        text: "Add new",
                    }}
                >
                    {fetchedAdminUsers.data.map((admin: Admin) => (
                        <tr className="border-b" key={admin.id}>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap capitalize">
                                {admin.name}
                            </td>
                            <td className="px-4 py-3 capitalize">
                                {admin.email}
                            </td>
                            <td className="px-4 py-3 size-10">
                                {admin.avatar ? (
                                    <img
                                        className=" object-contain rounded-md cursor-pointer border"
                                        src={`/storage/${admin.avatar}`}
                                        alt="Payment Screenshot"
                                    />
                                ) : (
                                    "..."
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap max-w-[200px] gap-1">
                                    {admin.roles?.map((role: Role) => (
                                        <Badge
                                            key={role.id}
                                            className="bg-secondary hover:bg-secondary text-gray-800"
                                        >
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            </td>

                            <td className="px-4 py-3">
                                <p
                                    className={cn({
                                        "text-green-500":
                                            admin.email_verified_at,
                                        "text-yellow-500":
                                            !admin.email_verified_at,
                                    })}
                                >
                                    {admin.email_verified_at
                                        ? "Verified"
                                        : "Unverified"}
                                </p>
                            </td>

                            <td className="px-4 py-3">
                                <Badge
                                    className={cn({
                                        "bg-green-500 hover:bg-green-500":
                                            admin.status,
                                        "bg-yellow-500 hover:bg-yellow-500":
                                            !admin.status,
                                    })}
                                >
                                    {admin.status ? "Active" : "Inactive"}
                                </Badge>
                            </td>

                            <TableAction
                                item={admin}
                                routeName="admin.admin-users"
                            >
                                <DropdownMenuItem asChild>
                                    <Link
                                        as="button"
                                        method="put"
                                        href={route(
                                            "admin.admin-users.status",
                                            admin.id
                                        )}
                                        className="w-full cursor-pointer"
                                    >
                                        <ToggleRight className="size-4" />{" "}
                                        {admin.status
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

PhoneNumbers.layout = (page: ReactNode) => <AppLayout children={page} />;

export default PhoneNumbers;
