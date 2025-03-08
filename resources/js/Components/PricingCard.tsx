import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { Check, MoveRight } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { pricingFeatures } from "@/constants/pricing-features";

interface PricingCardProps {
    period: Period;
    className?: string;
}

export const PricingCard = ({ period, className }: PricingCardProps) => {
    const {
        auth: { user },
        subscription,
    } = usePage().props;

    const periodTextMap: Record<string, string> = {
        monthly: "per month",
        weekly: "per week",
        yearly: "per year",
    };

    return (
        <div
            className={cn(
                "relative rounded-2xl bg-white shadow-lg border border-gray-200",
                {
                    "border-2 border-primary shadow-primary/30":
                        subscription &&
                        subscription?.order?.period === period.value,
                },
                className
            )}
        >
            {subscription && subscription?.order?.period === period.value && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                    Active
                </div>
            )}

            <div className="p-5">
                <h3 className="my-2 text-center font-display text-2xl font-bold capitalize">
                    {period.value}
                </h3>

                <p className="my-3 font-display text-5xl font-semibold">
                    ${period?.price}
                </p>

                {periodTextMap[period.value] && (
                    <p className="text-gray-500">
                        {periodTextMap[period.value]}
                    </p>
                )}
            </div>

            <div className="px-5">
                {user ? (
                    <>
                        {subscription &&
                        subscription?.order?.period === period.value ? (
                            <Button
                                disabled
                                className="w-full py-5 rounded-xl bg-primary/50"
                            >
                                Upgrade now
                                <MoveRight className="h-5 w-5 ml-1.5" />
                            </Button>
                        ) : (
                            <Link
                                as="button"
                                href={route("checkouts.index", {
                                    period: period.value,
                                })}
                                className={buttonVariants({
                                    className:
                                        "w-full py-5 rounded-xl bg-gradient-to-r from-primary to-cyan-600",
                                })}
                            >
                                Upgrade now
                                <MoveRight className="h-5 w-5 ml-1.5" />
                            </Link>
                        )}
                    </>
                ) : (
                    <Link
                        href="/login"
                        className={buttonVariants({
                            className:
                                "w-full py-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600",
                        })}
                    >
                        Sign in
                        <MoveRight className="h-5 w-5 ml-1" />
                    </Link>
                )}
            </div>

            <ul className="my-6 space-y-4 px-8">
                {pricingFeatures.map(({ text }) => (
                    <li key={text} className="flex space-x-3">
                        <div className="flex-shrink-0">
                            <Check className="size-5 text-blue-500" />
                        </div>
                        <p className="text-gray-600">{text}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
