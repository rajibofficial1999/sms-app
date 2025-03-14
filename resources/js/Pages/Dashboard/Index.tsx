import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import DailyMessagesChart from "./Partials/DailyMessagesChart";
import DailyTrafficsChart from "./Partials/DailyTrafficsChart";
import OrderTable from "./Partials/OrderTable";
import TotalMessage from "./Partials/TotalMessage";
import TotalTraffic from "./Partials/TotalTraffic";

const Dashboard = () => {
    return (
        <ScrollArea className="h-screen px-4">
            <Head title="Dashboard" />
            <div className="p-4 grid grid-cols-1 gap-4 lg:grid-cols-2 mb-24">
                <div className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Daily counts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4 flex-col sm:flex-row">
                            <TotalTraffic />
                            <TotalMessage />
                        </CardContent>
                    </Card>
                    <div className="mt-4 border rounded-lg">
                        <OrderTable />
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <DailyTrafficsChart />
                    <DailyMessagesChart />
                </div>
            </div>
        </ScrollArea>
    );
};

Dashboard.layout = (page: ReactNode) => <AuthLayout children={page} />;

export default Dashboard;
