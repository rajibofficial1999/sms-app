import DashboardBreadcrumb from "@/Components/DashboardBreadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { ReactNode } from "react";

const breadcrumbItems: BreadcrumbItem[] = [
    {
        name: "Dashboard",
        href: route("dashboard"),
    },
    {
        name: "Billings",
    },
];

const Billings = ({
    subscription,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) => {
    return (
        <>
            <div className="px-4">
                <Head title="Billings" />

                <DashboardBreadcrumb
                    items={breadcrumbItems}
                    className="p-4 sm:p-8"
                />

                <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <h1 className="font-semibold mb-2 text-neutral-600">
                            Billing Period
                        </h1>
                        <div className="shadow p-5 rounded-lg bg-gray-100/15 flex flex-col gap-2 h-32">
                            <div className="flex justify-between items-center">
                                <h1 className="font-bold">Monthy</h1>
                                <div className="relative flex items-center">
                                    <div
                                        className={cn(
                                            "absolute size-2 rounded-full bg-green-600",
                                            {
                                                "!bg-red-500":
                                                    subscription.is_expired,
                                            }
                                        )}
                                    />
                                    <p
                                        className={cn(
                                            "ml-3 text-xs text-gray-500",
                                            {
                                                "!text-red-500":
                                                    subscription.is_expired,
                                            }
                                        )}
                                    >
                                        active
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Next Renewal:{" "}
                                {format(subscription.expired_at, "MMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-semibold mb-2 text-neutral-600">
                            Payment Method
                        </h1>
                        <div className="shadow p-5 rounded-lg bg-gray-100/15 flex flex-col gap-2 h-32">
                            <h1 className="font-bold">By Card</h1>
                            <h1 className=" text-sm">ALBERT K. DANIEL</h1>
                            <p className="text-xs text-gray-500">
                                Expires on:{" "}
                                {format(subscription.expired_at, "MMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-500 p-4 sm:p-8">
                    <span className="inline cursor-pointer underline text-brand-600">
                        {" "}
                        Upgrade now to increase your period &rarr;
                    </span>
                </p>
            </div>
        </>
    );
};

Billings.layout = (page: ReactNode) => <AuthLayout children={page} />;

export default Billings;
