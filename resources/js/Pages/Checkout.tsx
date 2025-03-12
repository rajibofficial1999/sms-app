import AreaCodeForm from "@/Components/AreaCodeForm";
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
    payment_screenshot: File | null;
    period: string;
    area_code: string;
    [key: string]: any;
}

const Checkout = () => {
    const {
        paymentMethods,
        package: selectedPackage,
        userPhoneNumber,
    } = usePage().props;

    // Form Handling
    const { setData, errors, post, processing, data } =
        useForm<CheckoutFormProps>({
            account_holder_name: "",
            payment_method: null,
            payment_screenshot: null,
            period: selectedPackage?.period || "",
            area_code: "",
        });

    // Stepper State
    const [step, setStep] = useState<number>(1);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
        null
    );

    // Form Validation for Button Disable
    const isButtonDisabled = () => {
        if (step === 1) return !userPhoneNumber && data.area_code.length !== 3;
        if (step === 2) return !selectedMethod;
        if (step === 3)
            return !data.account_holder_name || !data.payment_screenshot;
        return false;
    };

    // Handle Next & Submit
    const handleButtonClick = () => {
        if (step === 3) {
            post(route("orders.store"), {
                preserveScroll: true,
                onSuccess: () => console.log("Payment successful"),
            });
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 1));
        console.log(step);
    };

    // Sync selected method with form data
    useEffect(() => {
        setData("payment_method", selectedMethod?.id || null);
    }, [selectedMethod]);

    return (
        <MaxWidthWrapper className="text-center h-full !max-h-[calc(100vh-3.5rem)] flex justify-center items-center">
            <div className="max-w-sm w-full mx-auto border p-4 rounded-md shadow shadow-primary/20">
                {step === 1 && (
                    <>
                        {userPhoneNumber ? (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Renew number
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Renew your number with the valid payment
                                    details
                                </p>
                                <h1 className="my-2">
                                    {userPhoneNumber.number}
                                </h1>
                            </div>
                        ) : (
                            <AreaCodeForm
                                setData={setData}
                                errors={errors}
                                data={data}
                            />
                        )}
                    </>
                )}
                {step === 2 && (
                    <SelectPaymentMethod
                        setSelectedMethod={setSelectedMethod}
                        selectedMethod={selectedMethod}
                        paymentMethods={paymentMethods}
                    />
                )}
                {step === 3 && (
                    <PaymentDetailsForm
                        selectedMethod={selectedMethod}
                        setData={setData}
                        errors={errors}
                    />
                )}

                <Button
                    disabled={isButtonDisabled()}
                    onClick={handleButtonClick}
                    className="w-full mt-5"
                >
                    {processing && (
                        <LoaderCircle className="ml-1 animate-spin" />
                    )}
                    {step < 3 ? "Next" : "Submit"}
                </Button>

                {step > 1 ? (
                    <Button
                        onClick={handleBack}
                        className="w-full mt-2"
                        variant="outline"
                    >
                        Go Back
                    </Button>
                ) : (
                    <Link
                        href={route("pricing")}
                        className={buttonVariants({
                            variant: "outline",
                            className: "w-full mt-2",
                        })}
                    >
                        Go Back
                    </Link>
                )}
            </div>
        </MaxWidthWrapper>
    );
};

Checkout.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Checkout;
