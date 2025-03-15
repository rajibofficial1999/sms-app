import { usePage } from "@inertiajs/react";
import {
    Banknote,
    DoorOpen,
    LayoutDashboard,
    ListOrdered,
    NotebookTabs,
    UserCog,
    Users,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import SidebarProfileDropdown from "./SidebarProfileDropdown";

const SidebarMobileMenu = () => {
    const {
        url,
        props: {
            auth: { admin },
        },
    } = usePage();

    return (
        <div className="flex flex-col justify-between h-full mt-2 mx-2 mb-4">
            <ul className="space-y-1">
                <li className="text-nowrap">
                    <SidebarLink
                        name="Dashboard"
                        href={route("admin.dashboard")}
                        Icon={LayoutDashboard}
                        isMobileLink={true}
                    />
                </li>
                {(admin.is_super_admin || admin.can_only.view_users) && (
                    <li className="text-nowrap">
                        <SidebarLink
                            name="Users"
                            href={route("admin.users.index")}
                            Icon={Users}
                            isMobileLink={true}
                        />
                    </li>
                )}

                {(admin.is_super_admin || admin.can_only.view_orders) && (
                    <li className="text-nowrap">
                        <SidebarLink
                            name="Orders"
                            href={route("admin.orders.index")}
                            Icon={ListOrdered}
                            isMobileLink={true}
                        />
                    </li>
                )}

                {(admin.is_super_admin ||
                    admin.can_only.view_payment_methods) && (
                    <li className="text-nowrap">
                        <SidebarLink
                            name="Payment methods"
                            href={route("admin.payment-methods.index")}
                            Icon={Banknote}
                            isMobileLink={true}
                        />
                    </li>
                )}

                {(admin.is_super_admin ||
                    admin.can_only.view_phone_numbers) && (
                    <li className="text-nowrap">
                        <SidebarLink
                            name="Phone numbers"
                            href={route("admin.phone-numbers.index")}
                            Icon={NotebookTabs}
                            isMobileLink={true}
                        />
                    </li>
                )}

                {(admin.is_super_admin || admin.can_only.admin_users) && (
                    <li className="text-nowrap">
                        <SidebarLink
                            name="Admin users"
                            href={route("admin.admin-users.index")}
                            Icon={UserCog}
                            isMobileLink={true}
                        />
                    </li>
                )}

                {(admin.is_super_admin || admin.can_only.view_roles) && (
                    <li className="text-nowrap">
                        <SidebarLink
                            name="Roles"
                            href={route("admin.roles.index")}
                            Icon={DoorOpen}
                            isMobileLink={true}
                        />
                    </li>
                )}
            </ul>
            <SidebarProfileDropdown />
        </div>
    );
};

export default SidebarMobileMenu;
