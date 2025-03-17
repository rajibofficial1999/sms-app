import { ScrollArea } from "@/Components/ui/scroll-area";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import AssignPermission from "./Partials/AssignPermission";
import RolePermissionForm from "./Partials/RolePermissionForm";
import RolesPermissions from "./Partials/RolesPermissions";

const Roles = () => {
    const {
        roles,
        permissions,
        auth: { admin },
    } = usePage().props;

    const [fetchedPermissions, setFetchedPermissions] = useState<Permission[]>(
        []
    );

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedPermission, setSelectedPermission] =
        useState<Permission | null>(null);

    const [fetchedRoles, setFetchedRoles] = useState<Role[]>([]);

    useEffect(() => {
        setFetchedRoles(roles);
        setFetchedPermissions(permissions);
    }, [roles, permissions]);

    return (
        <>
            <ScrollArea className="h-screen py-5">
                <Head title="Manege roles" />

                <div className="pb-12">
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        {admin.is_super_admin ||
                            (admin.can_only.create_role && (
                                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                    <RolePermissionForm
                                        selectedRole={selectedRole}
                                        selectedPermission={selectedPermission}
                                        setSelectedRole={setSelectedRole}
                                        setSelectedPermission={
                                            setSelectedPermission
                                        }
                                    />
                                </div>
                            ))}
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <RolesPermissions
                                roles={fetchedRoles}
                                permissions={fetchedPermissions}
                                setSelectedRole={setSelectedRole}
                                setSelectedPermission={setSelectedPermission}
                            />
                        </div>
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <AssignPermission roles={fetchedRoles} />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </>
    );
};

Roles.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Roles;
