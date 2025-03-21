import AdminEmailVerifyModal from "@/Components/Admin/AdminEmailVerifyModal";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

interface AdminUserForm {
    name: string;
    email: string;
    roles: number[];
    password: string;
    password_confirmation: string;
    [key: string]: any;
}

const Edit = () => {
    const { roles, email, admin } = usePage().props;
    const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);

    const animatedComponents = makeAnimated();

    const filterRoles = roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));

    const filterAlreadyAssignedRoles = admin?.roles?.map((role) => ({
        value: role.id,
        label: role.name,
    }));

    const { setData, errors, data, processing, patch, reset } =
        useForm<AdminUserForm>({
            name: admin.name,
            email: admin.email,
            password: "",
            password_confirmation: "",
            roles: admin?.roles ? admin.roles.map((role) => role.id) : [],
        });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(route("admin.admin-users.update", admin.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset(
                    "password",
                    "password_confirmation",
                    "roles",
                    "email",
                    "name"
                );
            },
        });
    };

    useEffect(() => {
        if (email) {
            setShowVerifyModal(true);
        }
    }, [email]);

    return (
        <>
            <Head title="Edit admin user" />

            <div className="h-screen flex justify-center items-center max-w-xl mx-auto">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Edit admin user
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    name="name"
                                    id="name"
                                    placeholder="Enter name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter email address"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.password}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    type="password"
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    placeholder="Enter confirm password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.password_confirmation}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="roles">Roles</Label>
                                <Select
                                    defaultValue={filterAlreadyAssignedRoles}
                                    components={animatedComponents}
                                    isMulti
                                    options={filterRoles}
                                    onChange={(item) => {
                                        const selectedRoles = item.map(
                                            (item: any) => item.value
                                        );
                                        setData("roles", selectedRoles);
                                    }}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.roles}
                                />
                            </div>

                            <div className="!mt-5">
                                <Button
                                    disabled={processing}
                                    type="submit"
                                    className="flex items-center"
                                >
                                    {processing && (
                                        <LoaderCircle className="animate-spin" />
                                    )}
                                    <span>Submit</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <AdminEmailVerifyModal
                showVerifyModal={showVerifyModal}
                setShowVerifyModal={setShowVerifyModal}
                email={email as string}
            />
        </>
    );
};

Edit.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Edit;
