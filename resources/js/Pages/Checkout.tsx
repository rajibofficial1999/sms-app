import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import PaymentDetailsForm from "@/Components/PaymentDetailsForm";
import SelectPaymentMethod from "@/Components/SelectPaymentMethod";
import { Button, buttonVariants } from "@/Components/ui/button";
import RootLayout from "@/Layouts/RootLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export interface CheckoutFormProps {
    account_holder_name: string;
    payment_method: number | null;
    payment_screenshot: string;
    period: string;
    [key: string]: any;
}

const Checkout = () => {
    const { paymentMethods, package: selectedPackage } = usePage().props;
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
        null
    );

    const { setData, errors, post, processing } = useForm<CheckoutFormProps>({
        account_holder_name: "",
        payment_method: null,
        payment_screenshot: "",
        period: selectedPackage?.period || "",
    });

    const [step, setStep] = useState<"payment_method" | "payment_details">(
        "payment_method"
    );

    const handleButtonClick = async () => {
        if (!selectedMethod) return;

        if (step === "payment_method") {
            setStep("payment_details");
            return;
        }

        if (step === "payment_details") {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        post(route("orders.store"), {
            preserveScroll: true,
            onSuccess: () => console.log("Payment successful"),
        });
    };

    useEffect(() => {
        setData("payment_method", selectedMethod?.id || null);
    }, [selectedMethod]);

    return (
        <>
            <MaxWidthWrapper className="text-center h-full !max-h-[calc(100vh-3.5rem)] flex justify-center items-center">
                <div className="max-w-sm w-full mx-auto border p-4 rounded-md shadow shadow-primary/20">
                    {step === "payment_method" && (
                        <SelectPaymentMethod
                            setSelectedMethod={setSelectedMethod}
                            selectedMethod={selectedMethod}
                            paymentMethods={paymentMethods}
                        />
                    )}

                    {step === "payment_details" && (
                        <PaymentDetailsForm
                            selectedMethod={selectedMethod}
                            setData={setData}
                            errors={errors}
                        />
                    )}

                    <Button
                        disabled={!selectedMethod || processing}
                        onClick={handleButtonClick}
                        className="w-full mt-5"
                    >
                        {processing && (
                            <LoaderCircle className="ml-1 animate-spin" />
                        )}
                        {step === "payment_method" ? "Next" : "Submit"}
                    </Button>
                    <Link
                        href={
                            step === "payment_method"
                                ? route("pricing")
                                : route("checkouts.index", {
                                      period: selectedPackage?.period,
                                  })
                        }
                        className={buttonVariants({
                            variant: "outline",
                            className: "w-full mt-2",
                        })}
                    >
                        Go Back
                    </Link>
                </div>
            </MaxWidthWrapper>
        </>
    );
};

Checkout.layout = (page: ReactNode) => <RootLayout children={page} />;

export default Checkout;
