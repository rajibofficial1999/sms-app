import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { ReactNode } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import DashboardBreadcrumb from "@/Components/DashboardBreadcrumb";
import { ScrollArea } from "@/Components/ui/scroll-area";
import BlockLists from "./Partials/BlockLists";

const breadcrumbItems: BreadcrumbItem[] = [
    {
        name: "Dashboard",
        href: route("dashboard"),
    },
    {
        name: "Settings",
    },
];

const Edit = ({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) => {
    return (
        <>
            <ScrollArea className="h-screen px-4">
                <Head title="Settings" />

                <DashboardBreadcrumb
                    items={breadcrumbItems}
                    className="p-4 sm:p-8"
                />

                <div className="pb-12">
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <BlockLists className="max-w-xl" />
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </>
    );
};

Edit.layout = (page: ReactNode) => <AuthLayout children={page} />;

export default Edit;
