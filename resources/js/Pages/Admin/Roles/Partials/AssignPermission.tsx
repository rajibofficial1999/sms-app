import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormProps {
    role_id: number | null;
    permissions: number[];
    [key: string]: any;
}

interface AssignPermissionProps {
    roles: Role[];
}

const AssignPermission: React.FC<AssignPermissionProps> = ({ roles }) => {
    const {
        auth: { admin },
    } = usePage().props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetchedPermissions, setFetchedPermissions] = useState<Permission[]>(
        []
    );
    const [hasPermissions, setHasPermissions] = useState<Permission[]>([]);

    const { post, data, setData, processing } = useForm<FormProps>({
        role_id: null,
        permissions: [],
    });

    const handleRoleChange = async (value: string) => {
        setIsLoading(true);
        setData("role_id", Number(value));
        try {
            const { data } = await axios.get(
                route("admin.roles.permissions", value)
            );
            setFetchedPermissions(data.permissions);
            setHasPermissions(data.hasPermissions);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = event.target;
        if (checked) {
            setData("permissions", [...data.permissions, Number(value)]);
        } else {
            setData(
                "permissions",
                data.permissions.filter((id) => id !== Number(value))
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.permissions.length <= 0 || data.role_id === null) {
            return;
        }

        post(route("admin.roles.assign_permission"), {
            preserveScroll: true,
            onSuccess: () => {
                setFetchedPermissions((prevStates: Permission[]) => {
                    return prevStates.filter(
                        (prevState) => !data.permissions.includes(prevState.id)
                    );
                });

                setHasPermissions((prevStates: Permission[]) => {
                    const newPermissions = fetchedPermissions.filter(
                        (permission) => data.permissions.includes(permission.id)
                    );

                    return [...prevStates, ...newPermissions];
                });

                setData("permissions", []);

                toast("Permission assigned successfully");
            },
        });
    };

    const handlePermissionDelete = (permission: Permission) => {
        router.post(
            route("admin.permissions.remove"),
            {
                permission: permission.id,
                role: data?.role_id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setHasPermissions((prevStates: Permission[]) => {
                        return prevStates.filter(
                            (prevState) => prevState.id !== permission.id
                        );
                    });

                    setFetchedPermissions((prevStates: Permission[]) => {
                        const newPermissions = hasPermissions.filter(
                            (hasPermission) =>
                                hasPermission.id === permission.id
                        );

                        return [...prevStates, ...newPermissions];
                    });

                    toast("Permission deleted successfully");
                },
            }
        );
    };

    return (
        <section>
            <header>
                <h2 className="text-xl font-medium text-gray-900">
                    Assign permissions to a role
                </h2>
            </header>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 sm:gap-x-6 mt-8">
                    <div className="my-5">
                        <h1 className="mb-2 font-semibold">Roles</h1>

                        <RadioGroup
                            className="ml-2 space-y-1 mt-4"
                            onValueChange={(value) => handleRoleChange(value)}
                        >
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center space-x-2"
                                >
                                    <RadioGroupItem
                                        value={String(role.id)}
                                        id={String(role.id)}
                                    />
                                    <Label
                                        htmlFor={String(role.id)}
                                        className="cursor-pointer"
                                    >
                                        {role.name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    {(admin.is_super_admin ||
                        admin.can_only.assign_permission) && (
                        <div className="my-5">
                            <h1 className="mb-2 font-semibold">Permissions</h1>

                            <ScrollArea className="h-72">
                                {isLoading ? (
                                    <LoaderCircle className="size-5 animate-spin" />
                                ) : fetchedPermissions.length > 0 ? (
                                    <div className="mt-4 space-y-3 px-5">
                                        {fetchedPermissions.map(
                                            (permission) => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <input
                                                        id={`permission-${permission.id}`}
                                                        type="checkbox"
                                                        className="checkbox checkbox-primary"
                                                        value={permission.id}
                                                        onChange={(event) =>
                                                            handleChecked(event)
                                                        }
                                                    />
                                                    <Label
                                                        className="cursor-pointer"
                                                        htmlFor={`permission-${permission.id}`}
                                                    >
                                                        {permission.name}
                                                    </Label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs">
                                        No permissions found
                                    </p>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                    {(admin.is_super_admin ||
                        admin.can_only.removed_assigned_permission) && (
                        <div className="my-5">
                            <h1 className="mb-2 font-semibold">
                                Has permissions
                            </h1>

                            <ScrollArea className="h-72">
                                {isLoading ? (
                                    <LoaderCircle className="size-5 animate-spin" />
                                ) : hasPermissions.length > 0 ? (
                                    <div className="mt-4 space-y-3">
                                        {hasPermissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handlePermissionDelete(
                                                            permission
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash className="size-4" />
                                                </button>
                                                <p>{permission.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs">
                                        No permissions found
                                    </p>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                </div>
                <Button
                    disabled={
                        processing ||
                        data.permissions.length <= 0 ||
                        data.role_id === null
                    }
                    type="submit"
                >
                    {processing && <LoaderCircle className="animate-spin" />}
                    Assign
                </Button>
            </form>
        </section>
    );
};

export default AssignPermission;
