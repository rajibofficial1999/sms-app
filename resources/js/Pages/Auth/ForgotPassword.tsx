import InputError from "@/Components/InputError";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { FormEventHandler, ReactNode } from "react";

export default function ForgotPassword({ status }: { status: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"), {
            onSuccess: () => reset("email"),
        });
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    Forgot password
                </h3>
                <p className="text-sm text-gray-500">
                    Let us know your email address and we will email you a
                    password reset link that will allow you to choose a new one.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center mt-2">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-4">
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="Enter your email"
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex flex-col items-center space-y-2">
                    <Button
                        className="w-full rounded-full flex items-center"
                        disabled={processing}
                    >
                        {processing && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        <span>Get Reset Link</span>
                    </Button>
                    <Link
                        href={route("login")}
                        className={buttonVariants({
                            variant: "secondary",
                            className: "w-full !rounded-full",
                        })}
                    >
                        <ArrowLeft className="size-5" />

                        <span>Back to sign in</span>
                    </Link>
                </div>
            </form>
        </>
    );
}

ForgotPassword.layout = (page: ReactNode) => <GuestLayout children={page} />;
