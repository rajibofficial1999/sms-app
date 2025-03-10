import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";

interface RolePermissionFormProps {
    selectedRole: Role | null;
    selectedPermission: Permission | null;
    setSelectedRole: Dispatch<SetStateAction<Role | null>>;
    setSelectedPermission: Dispatch<SetStateAction<Permission | null>>;
}

const RolePermissionForm: React.FC<RolePermissionFormProps> = ({
    selectedRole,
    selectedPermission,
    setSelectedRole,
    setSelectedPermission,
}) => {
    const roleForm = useForm({
        name: "",
    });

    const permissionForm = useForm({
        name: "",
    });

    const submitRole = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedRole) {
            updateRole();
        } else {
            storeRole();
        }
    };

    const submitPermission = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedPermission) {
            updatePermission();
        } else {
            storePermission();
        }
    };

    const storeRole = () => {
        roleForm.post(route("admin.roles.store"), {
            preserveScroll: true,
            onSuccess: () => {
                resetAllForm();
                toast("Role created successfully");
            },
        });
    };

    const updateRole = () => {
        roleForm.put(route("admin.roles.update", selectedRole?.id), {
            preserveScroll: true,
            onSuccess: () => {
                resetAllForm();
                toast("Role updated successfully");
            },
        });
    };

    const storePermission = () => {
        permissionForm.post(route("admin.permissions.store"), {
            preserveScroll: true,
            onSuccess: () => {
                resetAllForm();
                toast("Permission created successfully");
            },
        });
    };

    const updatePermission = () => {
        permissionForm.put(
            route("admin.permissions.update", selectedPermission?.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    resetAllForm();
                    toast("Permission updated successfully");
                },
            }
        );
    };

    const resetAllForm = () => {
        roleForm.data.name = "";
        permissionForm.data.name = "";
        setSelectedRole(null);
        setSelectedPermission(null);
    };

    useEffect(() => {
        if (selectedRole) {
            roleForm.setData("name", selectedRole.name || "");
        }
    }, [selectedRole]);

    useEffect(() => {
        if (selectedPermission) {
            permissionForm.setData("name", selectedPermission.name || "");
        }
    }, [selectedPermission]);
    return (
        <section>
            <header>
                <h2 className="text-xl font-medium text-gray-900">
                    Manage user role
                </h2>
            </header>

            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 sm:gap-x-6">
                <form onSubmit={submitRole} className="mt-6 space-y-4">
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            className="mt-1 block w-full"
                            placeholder="Enter role"
                            autoComplete="role"
                            value={roleForm.data.name}
                            onChange={(e) =>
                                roleForm.setData("name", e.target.value)
                            }
                        />

                        <InputError
                            className="mt-2"
                            message={roleForm.errors.name}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button disabled={roleForm.processing} type="submit">
                            {roleForm.processing && (
                                <LoaderCircle className="ml-1 animate-spin" />
                            )}
                            Save
                        </Button>
                        {selectedRole && (
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={resetAllForm}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
                <form onSubmit={submitPermission} className="mt-6 space-y-4">
                    <div>
                        <Label htmlFor="permission">Permission</Label>
                        <Input
                            id="permission"
                            className="mt-1 block w-full"
                            placeholder="Enter permission"
                            autoComplete="permission"
                            value={permissionForm.data.name}
                            onChange={(e) =>
                                permissionForm.setData("name", e.target.value)
                            }
                        />

                        <InputError
                            className="mt-2"
                            message={permissionForm.errors.name}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="submit"
                            disabled={permissionForm.processing}
                        >
                            {permissionForm.processing && (
                                <LoaderCircle className="ml-1 animate-spin" />
                            )}
                            Save
                        </Button>
                        {selectedPermission && (
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={resetAllForm}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
};

export default RolePermissionForm;
