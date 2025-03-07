import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { ReactNode } from "react";

const Dashboard = () => {
    return (
        <>
            <Head title="Dashboard" />
            <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
        </>
    );
};

Dashboard.layout = (page: ReactNode) => <AuthLayout children={page} />;

export default Dashboard;
