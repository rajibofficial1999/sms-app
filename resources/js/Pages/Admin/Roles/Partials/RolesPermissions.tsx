import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { router, useForm } from "@inertiajs/react";
import { LoaderCircle, PenBoxIcon, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
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
    const [confirmingDeletion, setConfirmingDeletion] =
        useState<boolean>(false);
    const [deleteableRole, setDeleteableRole] = useState<Role | null>(null);
    const [deleteablePermission, setDeleteablePermission] =
        useState<Permission | null>(null);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleDelete = (
        item: Role | Permission,
        type: "role" | "permission"
    ) => {
        if (type === "role") {
            setDeleteableRole(item as Role);
        } else {
            setDeleteablePermission(item as Permission);
        }

        setConfirmingDeletion(true);
    };

    const handleDeletePermission = (id: number) => {
        router.delete(route("admin.permissions.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setDeleteablePermission(null);
                toast("Permission deleted successfully");
            },
        });
    };

    const handleDeleteRole = (id: number) => {
        router.delete(route("admin.roles.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setDeleteableRole(null);
                toast("Role deleted successfully");
            },
        });
    };

    const confirmDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsProcessing(true);

        if (deleteableRole) {
            handleDeleteRole(deleteableRole.id);
        } else if (deleteablePermission) {
            handleDeletePermission(deleteablePermission.id);
        }

        setConfirmingDeletion(false);
    };

    const closeModal = () => {
        setDeleteablePermission(null);
        setDeleteableRole(null);
        setConfirmingDeletion(false);
    };

    return (
        <>
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
                                                handleDelete(role, "role")
                                            }
                                            className="text-red-500"
                                        >
                                            <Trash className="size-4" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setSelectedRole(role)
                                            }
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
                                                handleDelete(
                                                    permission,
                                                    "permission"
                                                )
                                            }
                                            className="text-red-500"
                                        >
                                            <Trash className="size-4" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setSelectedPermission(
                                                    permission
                                                )
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

            <Modal
                isOpen={confirmingDeletion}
                setIsOpen={setConfirmingDeletion}
                onClose={closeModal}
            >
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
                            onClick={closeModal}
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

export default RolesPermissions;
