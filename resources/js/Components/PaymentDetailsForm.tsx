import { usePage } from "@inertiajs/react";
import { Heading1, ScanLine } from "lucide-react";
import { FC, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";
import FileInput from "./FileInput";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import QRCodeGenerator from "./QRCodeGenerator";
import { CheckoutFormProps } from "@/Pages/Checkout";
import { cn } from "@/lib/utils";

interface PaymentDetailsFormProps {
    selectedMethod: PaymentMethod | null;
    setData: (
        field: keyof CheckoutFormProps,
        value: CheckoutFormProps[keyof CheckoutFormProps]
    ) => void;
    errors: Partial<Record<keyof CheckoutFormProps, string>>;
}

const PaymentDetailsForm: FC<PaymentDetailsFormProps> = ({
    selectedMethod,
    setData,
    errors,
}) => {
    const { package: selectedPackage } = usePage().props;

    const [showQRCode, setShowQRCode] = useState<boolean>(false);

    return (
        <>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Payment Details
                </h3>
                <p className="text-sm text-gray-500">
                    Provider your payment details
                </p>
            </div>
            <div className="my-6 flex gap-1 justify-center">
                <Button
                    className="border-primary text-primary hover:text-primary"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowQRCode(!showQRCode)}
                >
                    <ScanLine />
                </Button>
            </div>
            {showQRCode ? (
                <div className="flex flex-col items-center">
                    <QRCodeGenerator
                        className="size-40 border rounded-md"
                        value={selectedMethod?.account_number?.toString() ?? ""}
                    />
                </div>
            ) : (
                <ul className="space-y-1 px-4">
                    <li>
                        <div className="flex items-center justify-between">
                            <h1 className="text-sm">Payment method</h1>
                            <p className="text-xs text-gray-500 capitalize">
                                {selectedMethod?.type}
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center justify-between">
                            <h1 className="text-sm">Account Number</h1>
                            <CopyToClipboard
                                text={
                                    selectedMethod?.account_number?.toString() ??
                                    ""
                                }
                                onCopy={() => toast("Copied to clipboard")}
                            >
                                <button
                                    title="Copy"
                                    className="cursor-pointer text-xs text-gray-500"
                                >
                                    {selectedMethod?.account_number}
                                </button>
                            </CopyToClipboard>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center justify-between">
                            <h1 className="text-sm">Account Type</h1>
                            <p className="text-xs text-gray-500 capitalize">
                                {selectedMethod?.account_type}
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center justify-between">
                            <h1 className="text-sm">Period</h1>
                            <p className="text-xs text-gray-500 capitalize">
                                {selectedPackage?.period}
                            </p>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center justify-between">
                            <h1 className="text-sm">Price</h1>
                            <p className="text-xs text-gray-500 capitalize">
                                {selectedPackage?.price} BDT
                            </p>
                        </div>
                    </li>
                </ul>
            )}
            <div className="flex flex-col mt-7">
                <div className="flex flex-col items-start gap-2">
                    <Label htmlFor="holder_name" className="text-gray-700">
                        Holder name
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        className={cn("w-full", {
                            "border-red-500 focus:!ring-0 focus:border-red-500":
                                errors.account_holder_name,
                        })}
                        placeholder="Enter account name"
                        onChange={(e) =>
                            setData("account_holder_name", e.target.value)
                        }
                    />
                    {errors.account_holder_name && (
                        <p className="text-sm text-red-500">
                            {errors.account_holder_name}
                        </p>
                    )}
                    {errors.period && (
                        <p className="text-sm text-red-500">{errors.period}</p>
                    )}
                    {errors.payment_method && (
                        <p className="text-sm text-red-500">
                            {errors.payment_method}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col mt-4">
                <div className="flex flex-col items-start gap-2">
                    <Label
                        htmlFor="payment_screenshot"
                        className="text-gray-700"
                    >
                        Payment screenshot with transaction ID
                    </Label>
                    <FileInput setData={setData} errors={errors} />
                    {errors.payment_screenshot && (
                        <p className="text-sm text-red-500">
                            {errors.payment_screenshot}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PaymentDetailsForm;
