import FileInput from "@/Components/FileInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Transition } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const admin = usePage().props.auth.admin;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: "PATCH",
            name: admin.name,
            email: admin.email,
            avatar: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("admin.profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                setData("avatar", null);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        placeholder="Enter your email address"
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && admin.email_verified_at === null && (
                    <div>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        placeholder="Enter your name"
                        onChange={(e) => setData("name", e.target.value)}
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <Label htmlFor="avatar">Avatar</Label>

                    <FileInput
                        errors={errors}
                        setData={setData}
                        name="avatar"
                        data={data}
                        className="mt-1"
                    />

                    <InputError className="mt-2" message={errors.avatar} />
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
}
