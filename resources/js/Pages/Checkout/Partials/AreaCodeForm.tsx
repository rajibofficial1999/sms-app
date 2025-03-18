import { CheckoutFormProps } from "@/Pages/Checkout/Index";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

interface AreaCodeFormProps {
    setData: (
        field: keyof CheckoutFormProps,
        value: CheckoutFormProps[keyof CheckoutFormProps]
    ) => void;
    errors: Partial<Record<keyof CheckoutFormProps, string>>;
    data: CheckoutFormProps;
}

const AreaCodeForm: FC<AreaCodeFormProps> = ({ setData, errors, data }) => {
    return (
        <>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Area code
                </h3>
                <p className="text-sm text-gray-500">
                    Provide area code for the number you want to use
                </p>
            </div>
            <div className="flex flex-col mt-7">
                <div className="flex flex-col items-start gap-2">
                    <Label htmlFor="area_code" className="text-gray-700">
                        Area code
                    </Label>
                    <Input
                        type="number"
                        id="area_code"
                        value={data.area_code}
                        className={cn("w-full", {
                            "border-red-500 focus:!ring-0 focus:border-red-500":
                                errors.area_code,
                        })}
                        placeholder="Area code"
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 3) {
                                setData("area_code", value);
                            } else {
                                e.target.blur();
                            }
                        }}
                    />
                    {errors.area_code && (
                        <p className="text-sm text-red-500">
                            {errors.area_code}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AreaCodeForm;
