import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Link, router, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminEmailVerifyModalProps {
    showVerifyModal: boolean;
    setShowVerifyModal: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
}

const AdminEmailVerifyModal: React.FC<AdminEmailVerifyModalProps> = ({
    showVerifyModal,
    setShowVerifyModal,
    email,
}) => {
    const verificationForm = useForm({
        code: "",
        email: "",
    });

    const handleVerify: FormEventHandler = (e) => {
        e.preventDefault();

        verificationForm.post(route("admin.verify.code"), {
            onSuccess: () => {
                verificationForm.reset("code", "email");
                toast("Email verified successfully");

                router.get(route("admin.admin-users.index"));
            },
        });
    };

    useEffect(() => {
        if (email) {
            verificationForm.setData("email", email);
        }
    }, [email]);

    return (
        <Modal
            isOpen={showVerifyModal}
            setIsOpen={setShowVerifyModal}
            preventDefaultClose={true}
        >
            <h1 className="text-center text-lg font-semibold">
                Email Verification
            </h1>

            <form onSubmit={handleVerify} className="mt-2">
                <p className="text-green-500 text-center ">
                    A verification code has been sent to the email address.
                </p>
                <div className="mt-2">
                    <Label htmlFor="password">Verification Code</Label>

                    <Input
                        id="code"
                        type="number"
                        name="code"
                        value={verificationForm.data.code}
                        className="mt-1 block w-full"
                        autoComplete="code"
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 6) {
                                verificationForm.setData("code", value);
                            } else {
                                e.target.blur();
                            }
                        }}
                        placeholder="Enter code"
                    />

                    <InputError
                        message={verificationForm.errors.code}
                        className="mt-2"
                    />
                    <InputError
                        message={verificationForm.errors.email}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <Link
                        href={route("admin.admin-users.index")}
                        as="button"
                        className={buttonVariants({
                            variant: "outline",
                            className: "ms-3",
                        })}
                    >
                        Cancel
                    </Link>
                    <Button
                        className="ms-3"
                        disabled={verificationForm.processing}
                    >
                        Verify
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AdminEmailVerifyModal;
