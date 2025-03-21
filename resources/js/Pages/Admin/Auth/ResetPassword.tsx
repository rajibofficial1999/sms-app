import AuthInput from "@/Components/AuthInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/Admin/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle, Lock } from "lucide-react";
import { FormEventHandler, ReactNode } from "react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("admin.password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    Set a new password
                </h3>
                <p className="text-sm text-gray-500">
                    Enter your new password below. Once you have completed this
                    step, you will be able to continue using your account.
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <AuthInput
                        name="password"
                        data={data}
                        type="password"
                        setData={setData}
                        placeholder="Enter new password"
                        errors={errors}
                        icon={Lock}
                    />

                    <InputError message={errors.password} className="mt-2" />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="password_confirmation">
                        Confirm Password
                    </Label>

                    <AuthInput
                        name="password_confirmation"
                        data={data}
                        type="password"
                        setData={setData}
                        placeholder="Confirm your password"
                        errors={errors}
                        icon={Lock}
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center">
                    <Button
                        className="w-full rounded-full flex items-center"
                        disabled={processing}
                    >
                        {processing && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        <span>Reset Password</span>
                    </Button>
                </div>
            </form>
        </>
    );
}

ResetPassword.layout = (page: ReactNode) => <GuestLayout children={page} />;
