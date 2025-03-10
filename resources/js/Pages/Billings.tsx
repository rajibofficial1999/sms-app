import DashboardBreadcrumb from "@/Components/DashboardBreadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
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

                {subscription && (
                    <>
                        <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            <div>
                                <h1 className="font-semibold mb-2 text-neutral-600">
                                    Billing Period
                                </h1>
                                <div className="shadow p-5 rounded-lg bg-gray-100/15 flex flex-col gap-2 h-32">
                                    <div className="flex justify-between items-center">
                                        <h1 className="font-bold capitalize">
                                            {subscription.period}
                                        </h1>
                                        <div className="relative flex items-center">
                                            <div
                                                className={cn(
                                                    "absolute size-2 rounded-full bg-red-600",
                                                    {
                                                        "!bg-yellow-500":
                                                            !subscription.is_expired &&
                                                            subscription.status ===
                                                                "pending",
                                                    },
                                                    {
                                                        "!bg-green-500":
                                                            !subscription.is_expired &&
                                                            subscription.status ===
                                                                "completed",
                                                    }
                                                )}
                                            />
                                            <p
                                                className={cn(
                                                    "ml-3 text-xs text-red-500 capitalize",
                                                    {
                                                        "!text-yellow-500":
                                                            !subscription.is_expired &&
                                                            subscription.status ===
                                                                "pending",
                                                    },
                                                    {
                                                        "!text-green-500":
                                                            !subscription.is_expired &&
                                                            subscription.status ===
                                                                "completed",
                                                    }
                                                )}
                                            >
                                                {!subscription.is_expired &&
                                                    subscription.status ===
                                                        "completed" &&
                                                    "active"}

                                                {!subscription.is_expired &&
                                                    subscription.status !==
                                                        "completed" &&
                                                    subscription.status}

                                                {subscription.is_expired &&
                                                    "Expired"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Next Renewal:{" "}
                                        {format(
                                            subscription.expired_at,
                                            "MMM d, yyyy"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h1 className="font-semibold mb-2 text-neutral-600">
                                    Payment Method
                                </h1>
                                <div className="shadow p-5 rounded-lg bg-gray-100/15 h-32 flex items-center gap-3">
                                    <div>
                                        <img
                                            src="/images/payment.png"
                                            alt="payment"
                                            className="size-20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h1 className="font-bold capitalize">
                                            {subscription?.payment_method?.type}
                                        </h1>

                                        <p className="text-xs text-gray-500">
                                            Expires on:{" "}
                                            {format(
                                                subscription.expired_at,
                                                "MMM d, yyyy"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {subscription.period.toLowerCase() !== "monthly" && (
                            <Link
                                href={route("pricing")}
                                className="text-sm text-gray-500 p-4 sm:p-8"
                            >
                                <span className="inline cursor-pointer underline text-brand-600">
                                    Upgrade now to increase your period &rarr;
                                </span>
                            </Link>
                        )}

                        {subscription.is_expired && (
                            <Link
                                href={route("checkouts.index", {
                                    period: subscription.period,
                                })}
                                className="text-sm text-gray-500 p-4 sm:p-8"
                            >
                                <span className="inline cursor-pointer underline text-brand-600">
                                    Renew now &rarr;
                                </span>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

Billings.layout = (page: ReactNode) => <AuthLayout children={page} />;

export default Billings;
