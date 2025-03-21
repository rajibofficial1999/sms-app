import AuthInput from "@/Components/AuthInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/Admin/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { FormEventHandler, ReactNode } from "react";

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("admin.login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Sign in" />

            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Admin Sign in
                </h3>
                <p className="text-sm text-gray-500">
                    This is the admin sign in page
                </p>
            </div>

            <form onSubmit={submit} className="mt-5">
                <div>
                    <Label htmlFor="email">Email</Label>

                    <AuthInput
                        name="email"
                        data={data}
                        type="email"
                        setData={setData}
                        placeholder="Enter email address"
                        errors={errors}
                        icon={Mail}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-2">
                    <Label htmlFor="password">Password</Label>

                    <AuthInput
                        name="password"
                        type="password"
                        data={data}
                        setData={setData}
                        placeholder="Enter password"
                        errors={errors}
                        icon={Lock}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            onCheckedChange={(checked) =>
                                setData("remember", checked as boolean)
                            }
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm text-gray-500 cursor-pointer"
                        >
                            Remember me
                        </Label>
                    </div>

                    <Link
                        href={route("admin.password.request")}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                        Forgot your password?
                    </Link>
                </div>
                <Button
                    className="mt-4 w-full flex items-center rounded-full"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="animate-spin" />}
                    <span>Sign in</span>
                </Button>
            </form>
        </>
    );
}

Login.layout = (page: ReactNode) => <GuestLayout children={page} />;
