import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { buttonVariants } from "@/Components/ui/button";
import RootLayout from "@/Layouts/RootLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { MoveRight } from "lucide-react";
import { ReactNode } from "react";

const Home = () => {
    const {
        auth: { user },
    } = usePage().props;
    return (
        <>
            <Head title="Home" />
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
                    <p className="text-sm font-semibold text-gray-700">
                        Quill is now public!
                    </p>
                </div>
                <h1 className="max-w-4xl text-4xl font-bold md:text-5xl lg:text-6xl">
                    Your <span className="text-blue-600">Private Number</span>{" "}
                    for Seamless Calls & Texts!
                </h1>
                <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
                    Get a virtual number for seamless calling and texting—no SIM
                    required. Stay connected anytime, anywhere!
                </p>

                <Link
                    as="button"
                    className={buttonVariants({
                        size: "lg",
                        className:
                            "mt-5 bg-gradient-to-r from-blue-600 to-cyan-600 !rounded-full",
                    })}
                    href={route("dashboard")}
                >
                    {user ? "Dashboard" : "Get started"}{" "}
                    <MoveRight className="ml-2 h-5 w-5" />
                </Link>

                <div>
                    <div className="relative isolate">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        >
                            <div
                                style={{
                                    clipPath:
                                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                                }}
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            />
                        </div>

                        <div>
                            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                                <div className="mt-16 flow-root sm:mt-24">
                                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                        <img
                                            src="/images/messages-preview-desktop.png"
                                            alt="preview inbox"
                                            width={1364}
                                            height={866}
                                            className="rounded-md hidden md:block bg-white p-6 shadow-2xl ring-1 ring-gray-900/10"
                                        />

                                        <img
                                            src="/images/messages-preview-mobile.png"
                                            alt="preview inbox"
                                            width={1364}
                                            height={866}
                                            className="rounded-md md:hidden bg-white p-6 shadow-2xl ring-1 ring-gray-900/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        >
                            <div
                                style={{
                                    clipPath:
                                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                                }}
                                className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
                    <div className="md-10 sm:mb-12 px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl sm:text-center">
                            <h2 className="mt-2 font-bold text-3xl text-gray-900 sm:text-5xl">
                                Start chatting after few steps
                            </h2>
                            <p className="mt-4 text-md sm:text-lg text-gray-600">
                                No setup hassle—just sign up, select a plan, and
                                start texting and calling!
                            </p>
                        </div>
                    </div>

                    <ol className="sm:my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
                        <li className="md:flex-1">
                            <StepComponent
                                stepText="Step 1"
                                header="Sign up for an account"
                                subHeader="Either start with a weekly plan or choose
                                    our monthly subscription for uninterrupted
                                    messaging."
                            />
                        </li>
                        <li className="md:flex-1">
                            <StepComponent
                                stepText="Step 2"
                                header="Order for your number"
                                subHeader="Place your order with area code and payment
                                    details, we'll get your number ready
                                    for you to use."
                            />
                        </li>
                        <li className="md:flex-1">
                            <StepComponent
                                stepText="Step 3"
                                header="Wait for your number to be ready"
                                subHeader="We will notify you once your number is
                                    ready. You can also check your order status
                                    on the dashboard."
                            />
                        </li>
                    </ol>
                </div>
            </MaxWidthWrapper>
        </>
    );
};

const StepComponent = ({
    header,
    subHeader,
    stepText,
}: {
    header: string;
    subHeader: string;
    stepText: string;
}) => {
    return (
        <div className="flex flex-col space-y-2 md:border-zinc-300 py-2 pl-4 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className="text-sm font-medium text-blue-600">
                {stepText}
            </span>
            <span className="text-xl font-semibold">{header}</span>
            <span className="mt-2 text-zinc-700">{subHeader}</span>
        </div>
    );
};

Home.layout = (page: ReactNode) => <RootLayout children={page} />;

export default Home;
