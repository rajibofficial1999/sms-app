import {
    ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import Chart from "./Chart";

const chartConfig = {
    users: {
        label: "Users",
    },
    trial: {
        label: "Trial",
        color: "hsl(var(--chart-4))",
    },
    subscription: {
        label: "Subscribed",
        color: "hsl(var(--chart-2))",
    },
    expired: {
        label: "Expired",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CategoriesUsersChart() {
    const { categoriesUserCharts } = usePage<PageProps<any>>().props;

    const [chartData] = React.useState(() =>
        categoriesUserCharts.data.map((item: any) => {
            if (item.key === "trial") {
                item.fill = "var(--color-trial)";
            }
            if (item.key === "subscription") {
                item.fill = "var(--color-subscription)";
            }

            if (item.key === "expired") {
                item.fill = "var(--color-expired)";
            }
            return item;
        })
    );

    const totalUsers = React.useMemo(() => {
        return chartData.reduce((acc: any, curr: any) => acc + curr.users, 0);
    }, []);

    return (
        <Chart
            title="Total users for the month"
            description={categoriesUserCharts.month}
            chartConfig={chartConfig}
            className="max-h-[250px] mx-auto aspect-square"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="users"
                    nameKey="key"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {totalUsers.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Users
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </Chart>
    );
}
