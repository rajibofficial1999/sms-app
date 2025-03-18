import AuthInput from "@/Components/AuthInput";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { LoaderCircle, Lock, Mail, User } from "lucide-react";
import { FormEventHandler, ReactNode, useState } from "react";

export default function Register() {
    const [term, setTerm] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!term) return;

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Sign up" />

            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Create an account
                </h3>
                <p className="text-sm text-gray-500">
                    Sign up for a new free account
                </p>
            </div>

            <form onSubmit={submit} className="mt-3">
                <div>
                    <Label htmlFor="name">Name</Label>

                    <AuthInput
                        name="name"
                        data={data}
                        setData={setData}
                        placeholder="Enter your name"
                        errors={errors}
                        icon={User}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-2">
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
                        data={data}
                        type="password"
                        setData={setData}
                        placeholder="Enter password"
                        errors={errors}
                        icon={Lock}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-2">
                    <Label htmlFor="password_confirmation">
                        Confirm Password
                    </Label>

                    <AuthInput
                        name="password_confirmation"
                        data={data}
                        type="password"
                        setData={setData}
                        placeholder="Confirm password"
                        errors={errors}
                        icon={Lock}
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center space-x-2 mt-3">
                    <Checkbox
                        required
                        id="terms"
                        onCheckedChange={(checked) =>
                            setTerm(checked as boolean)
                        }
                    />
                    <Label
                        htmlFor="terms"
                        className="text-sm text-gray-500 cursor-pointer"
                    >
                        I accept the{" "}
                        <Link
                            className="text-blue-500"
                            href="/terms-and-conditions"
                        >
                            Terms and Conditions
                        </Link>
                    </Label>
                </div>

                <Button
                    className="mt-4 w-full flex items-center rounded-full"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="animate-spin" />}
                    <span>Sign up</span>
                </Button>

                <div className="text-center mt-2 text-sm">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </>
    );
}

Register.layout = (page: ReactNode) => <GuestLayout children={page} />;
