import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, ReactNode } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
    const resendForm = useForm({});

    const { post, data, setData, errors, processing } = useForm({
        code: "",
    });

    const resendCode: FormEventHandler = (e) => {
        e.preventDefault();

        resendForm.post(route("verification.send"));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("verify.code"));
    };

    return (
        <>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600 text-center">
                If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === "verification-link-sent" && (
                <div className="m2-4 text-center text-sm font-medium text-green-600">
                    A new verification code has been sent to the email address.
                </div>
            )}

            <div className="space-y-2">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="code">Code</Label>

                        <Input
                            id="code"
                            type="number"
                            name="code"
                            value={data.code}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 6) {
                                    setData("code", value);
                                } else {
                                    e.target.blur();
                                }
                            }}
                            placeholder="Enter code"
                        />

                        <InputError message={errors.code} className="mt-2" />
                    </div>

                    <div className="mt-4 flex items-center flex-col space-y-2">
                        <Button
                            className="w-full rounded-full flex items-center"
                            disabled={processing}
                        >
                            {processing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            <span>Verify</span>
                        </Button>
                    </div>
                </form>
                <form onSubmit={resendCode}>
                    <Button
                        variant="outline"
                        className="w-full rounded-full flex items-center"
                        disabled={resendForm.processing}
                    >
                        {resendForm.processing && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        <span>Resend code</span>
                    </Button>
                </form>
            </div>
        </>
    );
}

VerifyEmail.layout = (page: ReactNode) => <GuestLayout children={page} />;
