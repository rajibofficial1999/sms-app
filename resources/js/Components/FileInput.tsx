import { cn } from "@/lib/utils";
import { CheckoutFormProps } from "@/Pages/Checkout";
import { Image } from "lucide-react";
import { FC } from "react";

interface FileInputProps {
    setData: (
        field: keyof CheckoutFormProps,
        value: CheckoutFormProps[keyof CheckoutFormProps]
    ) => void;
    errors: Partial<Record<keyof CheckoutFormProps, string>>;
}

const FileInput: FC<FileInputProps> = ({ setData, errors }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <label
                htmlFor="dropzone-file"
                className={cn(
                    "flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                    {
                        "border-red-500": errors.payment_screenshot,
                    }
                )}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Image
                        className={cn("size-8", {
                            "text-red-500": errors.payment_screenshot,
                        })}
                    />
                    <p className="text-sm text-gray-500">
                        <span
                            className={cn("font-semibold", {
                                "text-red-500": errors.payment_screenshot,
                            })}
                        >
                            Click to upload
                        </span>
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                        setData("payment_screenshot", e.target.files?.[0] || "")
                    }
                />
            </label>
        </div>
    );
};

export default FileInput;
