import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

interface SelectPaymentMethodProps {
    paymentMethods: PaymentMethod[];
    selectedMethod: PaymentMethod | null;
    setSelectedMethod: Dispatch<SetStateAction<PaymentMethod | null>>;
}

const SelectPaymentMethod: FC<SelectPaymentMethodProps> = ({
    paymentMethods,
    selectedMethod,
    setSelectedMethod,
}) => {
    return (
        <>
            <>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Payment methods
                    </h3>
                    <p className="text-sm text-gray-500">
                        Select the payment method you want to use
                    </p>
                </div>

                {/* Item start */}
                <div className="mt-10 grid grid-cols-1 gap-4">
                    {paymentMethods.map((paymentMethod) => (
                        <div
                            key={paymentMethod.id}
                            onClick={() => setSelectedMethod(paymentMethod)}
                            className={cn(
                                "border rounded-lg cursor-pointer p-1",
                                {
                                    "border-primary bg-primary/5":
                                        selectedMethod?.id === paymentMethod.id,
                                }
                            )}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-start gap-2">
                                    <img
                                        src={`/storage/${paymentMethod?.logo}`}
                                        alt="payment-type"
                                        className="size-8 rounded-lg"
                                    />
                                    <div>
                                        <p className="capitalize text-sm text-left">
                                            {paymentMethod.type}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        </>
    );
};

export default SelectPaymentMethod;
