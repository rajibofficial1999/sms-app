import Table from "@/Components/Table";
import TableAction from "@/Components/TableAction";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { cn } from "@/lib/utils";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import debounce from "debounce";
import { LoaderCircle, PenBox, ToggleRight } from "lucide-react";
import { FormEventHandler, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

const headers = ["Phone number", "Area code", "User", "Status"];

const PhoneNumbers = () => {
    const {
        phoneNumbers,
        auth: { admin },
    } = usePage().props;
    const [fetchedPhoneNumbers, setFetchedPhoneNumbers] =
        useState<any>(phoneNumbers);
    const [show, setShowModal] = useState<boolean>(false);
    const [editNumber, setEditNumber] = useState<PhoneNumber | null>(null);

    const { put, setData, errors, processing, reset } = useForm({
        number: "",
    });

    const handleSearch = debounce(async (query) => {
        try {
            const { data } = await axios.get(
                route("admin.phone-numbers.search", { search: query })
            );

            setFetchedPhoneNumbers(data.phoneNumbers);
        } catch (error) {
            console.error(error);
        }
    }, 300);

    const handleUpdatePhoneNumber: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("admin.phone-numbers.update", editNumber?.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast("Phone number updated successfully");
            },
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setEditNumber(null);
        reset();
    };

    useEffect(() => {
        setFetchedPhoneNumbers(phoneNumbers);
    }, [phoneNumbers]);

    return (
        <>
            <div className="my-5">
                <Head title="Phone numbers" />
                <Table
                    isActionRequired={true}
                    headers={headers}
                    data={fetchedPhoneNumbers}
                    handleSearch={handleSearch}
                    searchBy="user name"
                >
                    {fetchedPhoneNumbers.data.map(
                        (phoneNumber: PhoneNumber) => (
                            <tr className="border-b" key={phoneNumber.id}>
                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap capitalize">
                                    {phoneNumber.number}
                                </td>
                                <td className="px-4 py-3 capitalize">
                                    {phoneNumber?.area_code}
                                </td>

                                <td className="px-4 py-3 capitalize">
                                    {phoneNumber?.user?.name}
                                </td>

                                <td className="px-4 py-3 capitalize">
                                    <Badge
                                        className={cn({
                                            "bg-green-500 hover:bg-green-500":
                                                phoneNumber.status,
                                            "bg-yellow-500 hover:bg-yellow-500":
                                                !phoneNumber.status,
                                        })}
                                    >
                                        {phoneNumber.status
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </td>

                                <TableAction
                                    item={phoneNumber}
                                    routeName="admin.phone-numbers"
                                    showEdit={false}
                                    showDelete={
                                        !!admin.can_only.delete_phone_number ||
                                        admin.is_super_admin
                                    }
                                >
                                    {(admin.is_super_admin ||
                                        admin.can_only
                                            .change_phone_number_status) && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                as="button"
                                                method="put"
                                                href={route(
                                                    "admin.phone-numbers.status",
                                                    phoneNumber.id
                                                )}
                                                className="w-full cursor-pointer"
                                            >
                                                <ToggleRight className="size-4" />{" "}
                                                {phoneNumber.status
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {(admin.is_super_admin ||
                                        admin.can_only.update_phone_number) && (
                                        <DropdownMenuItem asChild>
                                            <button
                                                type="button"
                                                className="w-full cursor-pointer"
                                                onClick={() => {
                                                    setEditNumber(phoneNumber);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <PenBox className="size-4" />{" "}
                                                Edit
                                            </button>
                                        </DropdownMenuItem>
                                    )}
                                </TableAction>
                            </tr>
                        )
                    )}
                </Table>
            </div>

            <Modal isOpen={show} setIsOpen={setShowModal} onClose={closeModal}>
                <h1 className="text-center text-lg font-semibold">
                    Update phone number
                </h1>
                <form onSubmit={handleUpdatePhoneNumber}>
                    <Label htmlFor="phone">Phone</Label>

                    <Input
                        id="phone"
                        type="text"
                        name="phone"
                        className="mt-1 w-full"
                        placeholder="+1 (555) 555-5555"
                        defaultValue={editNumber?.number ?? ""}
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

PhoneNumbers.layout = (page: ReactNode) => <AppLayout children={page} />;

export default PhoneNumbers;
