import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Transition } from "@headlessui/react";
import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";

interface MessageProviderFormProps {
    className?: string;
}

interface FormData {
    name: string;
    [key: string]: any;
}

const MessageProviderForm: React.FC<MessageProviderFormProps> = ({
    className,
}) => {
    const { providers, active_provider } = usePage<PageProps<any>>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<FormData>({
            name: active_provider?.name || "",
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("admin.settings.set_provider"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("app_logo", null);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-medium text-gray-900">
                    Message Provider
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="name">Select provider name</Label>

                    <Select
                        defaultValue={active_provider?.name}
                        onValueChange={(value) => setData("name", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {providers.map((name: string) => (
                                <SelectItem
                                    className="capitalize"
                                    value={name}
                                    key={name}
                                >
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <InputError className="mt-2" message={errors.name} />
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

export default MessageProviderForm;
