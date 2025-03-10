import AppLayout from "@/Layouts/Admin/AppLayout";
import { Head } from "@inertiajs/react";
import { ReactNode } from "react";

const Dashboard = () => {
    return (
        <div>
            <Head title="Dashboard" />
            Start putting content on grids or panels, you can also use different
            combinations of grids.Please check out the dashboard and other pages
        </div>
    );
};

Dashboard.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Dashboard;
