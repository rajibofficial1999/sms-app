import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { PricingCard } from "@/Components/PricingCard";
import RootLayout from "@/Layouts/RootLayout";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";

const Pricing = () => {
    const { periods } = usePage().props;
    const [periodValue, setPeriodValue] = useState<PeriodValue>("weekly");
    const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

    useEffect(() => {
        const period = periods.find((period) => period.value === periodValue);
        setSelectedPeriod(period as Period);
    }, [periodValue]);

    return (
        <>
            <MaxWidthWrapper className="mb-8 mt-24 text-center ">
                <div className="mx-auto mb-10 sm:max-w-lg">
                    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                        Pricing
                    </h1>
                    <p className="mt-5 text-gray-600 sm:text-lg">
                        Whether you&apos;re just trying out our service or need
                        more, we&apos;ve got you covered.
                    </p>
                </div>

                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-2 items-center border border-primary rounded-full">
                        {periods.map((period, index) => (
                            <button
                                onClick={() => setPeriodValue(period.value)}
                                key={period.value}
                                type="button"
                                className={cn(
                                    "px-3 py-2 cursor-pointer capitalize",
                                    {
                                        "bg-gradient-to-r from-primary to-cyan-600 text-white":
                                            periodValue === period.value,
                                        "rounded-l-full": index === 0,
                                        "rounded-r-full":
                                            index === periods.length - 1,
                                    }
                                )}
                            >
                                {period.value}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    className={cn(
                        `pt-12 grid grid-cols-1 gap-10 mx-auto items-center max-w-sm`
                    )}
                >
                    {selectedPeriod && <PricingCard period={selectedPeriod} />}
                </div>
            </MaxWidthWrapper>
        </>
    );
};

Pricing.layout = (page: ReactNode) => <RootLayout children={page} />;

export default Pricing;
