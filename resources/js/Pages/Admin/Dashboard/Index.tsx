import { Card, CardContent } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import AppLayout from "@/Layouts/Admin/AppLayout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Coins, HandCoins, Landmark } from "lucide-react";
import { ReactNode } from "react";
import { CategoriesMMSChart } from "./Partials/CategoriesMMSChart";
import { CategoriesOrdersChart } from "./Partials/CategoriesOrdersChart";
import { CategoriesSMSChart } from "./Partials/CategoriesSMSChart";
import { CategoriesUsersChart } from "./Partials/CategoriesUsersChart";
import { OrdersChart } from "./Partials/OrdersChart";
import { UsersChart } from "./Partials/UsersChart";

const Dashboard = () => {
    const { profit, sales, consumed } = usePage<PageProps<any>>().props;

    return (
        <ScrollArea className="h-screen px-4">
            <Head title="Dashboard" />
            <div className="w-full mb-24 space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-4 sm:flex-row lg:flex-col">
                        <Card className="flex-1 flex items-center pt-6">
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="size-14 bg-primary/10 flex items-center justify-center rounded-full text-primary">
                                        <HandCoins className="size-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">
                                            {sales}
                                        </h1>
                                        <p className="text-sm text-gray-600">
                                            Total sales
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 flex items-center pt-6">
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="size-14 bg-red-50 flex items-center justify-center rounded-full text-red-500">
                                        <Landmark className="size-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">
                                            {consumed}
                                        </h1>
                                        <p className="text-sm text-gray-600">
                                            Total consumed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 flex items-center pt-6">
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="size-14 bg-green-50 flex items-center justify-center rounded-full text-green-500">
                                        <Coins className="size-5" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">
                                            {profit}
                                        </h1>
                                        <p className="text-sm text-gray-600">
                                            Total profit
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <CategoriesUsersChart />
                    <CategoriesOrdersChart />
                    <CategoriesSMSChart />
                    <CategoriesMMSChart />
                    <div className="col-span-1 lg:col-span-3 xl:col-span-2 grid lg:grid-cols-2 xl:grid-cols-1 gap-4">
                        <OrdersChart />

                        <UsersChart cardClassName="xl:hidden block" />
                    </div>
                </div>
                <UsersChart cardClassName="xl:block hidden" />
            </div>
        </ScrollArea>
    );
};

Dashboard.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Dashboard;
