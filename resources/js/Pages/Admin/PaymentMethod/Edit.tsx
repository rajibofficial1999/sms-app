import FileInput from "@/Components/FileInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEvent, ReactNode } from "react";
import { toast } from "sonner";

interface PaymentMethodForm {
    type: string;
    account_number: string;
    account_type: string;
    logo: File | null;
    [key: string]: any;
}

const Create = () => {
    const { accountTypes, paymentMethod } = usePage().props;

    const { setData, errors, data, processing, post } =
        useForm<PaymentMethodForm>({
            _method: "PUT",
            type: paymentMethod.type,
            account_number: String(paymentMethod.account_number),
            account_type: paymentMethod.account_type,
            logo: null,
        });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("admin.payment-methods.update", paymentMethod.id), {
            preserveScroll: true,
            onSuccess: () => toast("Payment method updated successfully"),
        });
    };

    return (
        <>
            <Head title="Update Payment Method" />

            <div className="h-screen flex justify-center items-center max-w-xl mx-auto">
                <div className="w-full">
                    <h1 className="mb-4 font-semibold text-gray-700 text-2xl">
                        Update Payment Method
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="type">Method type</Label>
                            <Input
                                name="type"
                                id="type"
                                placeholder="Payment method type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            />

                            <InputError
                                className="mt-2"
                                message={errors.type}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="account_number">
                                Account Number
                            </Label>
                            <Input
                                type="number"
                                name="account_number"
                                id="account_number"
                                placeholder="Account number"
                                value={data.account_number}
                                onChange={(e) =>
                                    setData("account_number", e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={errors.account_number}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="account_number">Account Type</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData("account_type", value)
                                }
                                defaultValue={paymentMethod.account_type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accountTypes.map((type: string) => (
                                        <SelectItem
                                            className="capitalize"
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <InputError
                                className="mt-2"
                                message={errors.account_type}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="log">Logo</Label>
                            <FileInput
                                errors={errors}
                                setData={setData}
                                name="logo"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.logo}
                            />
                        </div>

                        <div className="!mt-5">
                            <Button
                                disabled={processing}
                                type="submit"
                                className="flex items-center"
                            >
                                {processing && (
                                    <LoaderCircle className="animate-spin" />
                                )}
                                <span>Submit</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

Create.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Create;
