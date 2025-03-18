import { Link, useForm } from "@inertiajs/react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ApplicationLogo from "./ApplicationLogo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
    Facebook,
    Github,
    Instagram,
    Linkedin,
    LoaderCircle,
    LucideIcon,
} from "lucide-react";
import { useEffect } from "react";

const Footer = () => {
    const { data, setData, errors, processing, post, reset } = useForm({
        email: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("subscribe"), {
            preserveScroll: true,
            onSuccess: () => {
                reset("email");
                toast("You are successfully subscribed");
            },
        });
    };

    useEffect(() => {
        if (errors.email) {
            toast(errors.email);
        }
    }, [errors]);

    return (
        <footer className="shadow-sm bg-gray-800">
            <MaxWidthWrapper className="flex flex-col items-center justify-center text-center">
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 text-gray-300">
                    <div className="flex flex-col lg:flex-row items-center lg:justify-between space-y-4">
                        <Link
                            href={route("home")}
                            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                        >
                            <ApplicationLogo className="h-6 w-auto text-primary" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                                ShareText
                            </span>
                        </Link>

                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
                            <li>
                                <FooterLink name="About" href="/" />
                            </li>
                            <li>
                                <FooterLink name="Privacy Policy" href="/" />
                            </li>
                            <li>
                                <FooterLink name="Licensing" href="/" />
                            </li>
                            <li>
                                <FooterLink name="Contact" href="/" />
                            </li>
                        </ul>

                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 space-x-4">
                            <li>
                                <FooterSocialLink
                                    icon={Facebook}
                                    href={route("home")}
                                />
                            </li>
                            <li>
                                <FooterSocialLink
                                    icon={Instagram}
                                    href={route("home")}
                                />
                            </li>
                            <li>
                                <FooterSocialLink
                                    icon={Linkedin}
                                    href={route("home")}
                                />
                            </li>
                            <li>
                                <FooterSocialLink
                                    icon={Github}
                                    href={route("home")}
                                />
                            </li>
                        </ul>
                    </div>
                    <hr className="my-6  sm:mx-auto border-gray-700 lg:my-8" />
                    <div className="space-y-10">
                        <div className="">
                            <h4 className="text-xl font-bold text-gray-100">
                                Subscribe to our newsletter
                            </h4>
                            <p className="text-sm">
                                Join the newsletter to get the latest updates.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="max-w-sm mx-auto mt-6 flex items-center gap-2">
                                    <Input
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Enter your email address"
                                    />
                                    <Button disabled={processing} type="submit">
                                        {processing && (
                                            <LoaderCircle className="animate-spin" />
                                        )}
                                        Subscribe
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <span className="block text-sm sm:text-center ">
                            © 2023{" "}
                            <Link href={route("home")} className="">
                                Flowbite™
                            </Link>
                            . All Rights Reserved.
                        </span>
                    </div>
                </div>
            </MaxWidthWrapper>
        </footer>
    );
};

const FooterLink = ({ name, href }: { name: string; href: string }) => {
    return (
        <Link
            href={href}
            className="me-4 md:me-6 hover:text-primary duration-200"
        >
            {name}
        </Link>
    );
};

const FooterSocialLink = ({
    icon,
    href,
}: {
    icon: LucideIcon;
    href: string;
}) => {
    const Icon = icon;
    return (
        <Link
            href={href}
            className="size-8 rounded-full border hover:scale-105 border-gray-100 flex justify-center items-center duration-200 hover:border-primary hover:text-primary"
        >
            <Icon className="size-5" />
        </Link>
    );
};

export default Footer;
