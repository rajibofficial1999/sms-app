import { router, useForm } from "@inertiajs/react";
import { PenBoxIcon, Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface RolesPermissionsProps {
    roles: Role[];
    permissions: Permission[];
    setSelectedRole: Dispatch<SetStateAction<Role | null>>;
    setSelectedPermission: Dispatch<SetStateAction<Permission | null>>;
}

const RolesPermissions: React.FC<RolesPermissionsProps> = ({
    roles,
    permissions,
    setSelectedRole,
    setSelectedPermission,
}) => {
    const handleDeletePermission = (id: number) => {
        router.delete(route("admin.permissions.destroy", id), {
            preserveScroll: true,
            onSuccess: () => toast("Permission deleted successfully"),
        });
    };

    const handleDeleteRole = (id: number) => {
        router.delete(route("admin.roles.destroy", id), {
            preserveScroll: true,
            onSuccess: () => toast("Role deleted successfully"),
        });
    };
    return (
        <section>
            <header>
                <h2 className="text-xl font-medium text-gray-900">
                    Roles and permissions
                </h2>
            </header>

            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 sm:gap-x-6 mt-8">
                <div>
                    <h1 className="mb-2 font-semibold">Roles</h1>
                    <ul className="space-y-2">
                        {roles.map((role) => (
                            <li
                                key={role.id}
                                className="flex items-center space-x-2"
                            >
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() =>
                                            handleDeleteRole(role.id)
                                        }
                                        className="text-red-500"
                                    >
                                        <Trash className="size-4" />
                                    </button>

                                    <button
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        <PenBoxIcon className="size-4" />
                                    </button>
                                </div>
                                <span>{role.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h1 className="mb-2 font-semibold">Permissions</h1>
                    <ul className="space-y-2">
                        {permissions.map((permission) => (
                            <li
                                key={permission.id}
                                className="flex items-center space-x-2"
                            >
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() =>
                                            handleDeletePermission(
                                                permission.id
                                            )
                                        }
                                        className="text-red-500"
                                    >
                                        <Trash className="size-4" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            setSelectedPermission(permission)
                                        }
                                        className="text-gray-600"
                                    >
                                        <PenBoxIcon className="size-4" />
                                    </button>
                                </div>
                                <span>{permission.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default RolesPermissions;
