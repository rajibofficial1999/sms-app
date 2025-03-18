import AppLayout from "@/Layouts/Admin/AppLayout";
import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import AppSettingsInformationForm from "./Partials/AppSettingsInformationForm";
import ServicePricingForm from "./Partials/ServicePricingForm";
import MessageProviderForm from "./Partials/MessageProviderForm";

const Edit = () => {
    return (
        <>
            <Head title="Settings" />
            <div className="pb-12">
                <div className="mx-auto space-y-6 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <AppSettingsInformationForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 w-full">
                        <ServicePricingForm />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 w-full">
                        <MessageProviderForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );
};

Edit.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Edit;
