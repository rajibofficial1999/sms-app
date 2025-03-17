import FileInput from "@/Components/FileInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Transition } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface AppSettingsInformationFormProps {
    className?: string;
}

interface FormData {
    app_name: string;
    app_description: string;
    app_logo: File | null;
    [key: string]: any;
}

const AppSettingsInformationForm: React.FC<AppSettingsInformationFormProps> = ({
    className,
}) => {
    const { app_settings } = usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm<FormData>({
            _method: "PATCH",
            app_name: app_settings?.app_name || "",
            app_description: app_settings?.app_description || "",
            app_logo: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("admin.settings.update_app_settings"), {
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
                    Application Information
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="name">App Name</Label>

                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.app_name}
                        placeholder="Enter application name"
                        onChange={(e) => setData("app_name", e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.app_name} />
                </div>

                <div>
                    <Label htmlFor="app_logo">App logo</Label>

                    <FileInput
                        errors={errors}
                        setData={setData}
                        name="app_logo"
                        data={data}
                        className="mt-1"
                    />

                    <InputError className="mt-2" message={errors.app_logo} />
                </div>

                <div>
                    <Label htmlFor="description">App Description</Label>

                    <TextareaAutosize
                        className="mt-1 block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                        minRows={3}
                        value={data.app_description}
                        placeholder="Enter application description"
                        onChange={(e) =>
                            setData("app_description", e.target.value)
                        }
                    />

                    <InputError
                        className="mt-2"
                        message={errors.app_description}
                    />
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

export default AppSettingsInformationForm;
