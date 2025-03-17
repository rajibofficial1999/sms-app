import FileInput from "@/Components/FileInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Transition } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

interface ServicePricingFormProps {
    className?: string;
}

interface FormData {
    incoming_sms_price: string;
    outgoing_sms_price: string;
    incoming_mms_price: string;
    outgoing_mms_price: string;
    incoming_call_price: string;
    outgoing_call_price: string;
    [key: string]: any;
}

interface Input {
    name: string;
    label: string;
}

const inputs: Input[] = [
    {
        name: "incoming_sms_price",
        label: "Incoming SMS price",
    },
    {
        name: "outgoing_sms_price",
        label: "Outgoing SMS price",
    },
    {
        name: "incoming_mms_price",
        label: "Incoming MMS price",
    },
    {
        name: "outgoing_mms_price",
        label: "Outgoing MMS price",
    },
    {
        name: "incoming_call_price",
        label: "Incoming call price",
    },
    {
        name: "outgoing_call_price",
        label: "Outgoing call price",
    },
];

const ServicePricingForm: React.FC<ServicePricingFormProps> = ({
    className,
}) => {
    const { service_prices } = usePage().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<FormData>({
            incoming_sms_price: service_prices?.incoming_sms_price || "",
            outgoing_sms_price: service_prices?.outgoing_sms_price || "",
            incoming_mms_price: service_prices?.incoming_mms_price || "",
            outgoing_mms_price: service_prices?.outgoing_mms_price || "",
            incoming_call_price: service_prices?.incoming_call_price || "",
            outgoing_call_price: service_prices?.outgoing_call_price || "",
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("admin.settings.update_service_prices"), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-medium text-gray-900">
                    Application Information
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 sm:gap-x-6 mt-8">
                    {inputs.map((input) => (
                        <div key={input.name}>
                            <Label htmlFor={input.name}>{input.label}</Label>

                            <Input
                                id={input.name}
                                type="number"
                                className="mt-1 block w-full"
                                value={data[input.name]}
                                placeholder={input.label}
                                onChange={(e) =>
                                    setData(input.name, e.target.value)
                                }
                            />

                            <InputError
                                className="mt-2"
                                message={errors[input.name]}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
};

export default ServicePricingForm;
