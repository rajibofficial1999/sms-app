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
    orders: {
        label: "Orders",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--chart-4))",
    },
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-2))",
    },
    rejected: {
        label: "Rejected",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CategoriesOrdersChart() {
    const { categoriesOrderCharts } = usePage<PageProps<any>>().props;

    const [chartData] = React.useState(() =>
        categoriesOrderCharts.data.map((item: any) => {
            if (item.key === "pending") {
                item.fill = "var(--color-pending)";
            }
            if (item.key === "completed") {
                item.fill = "var(--color-completed)";
            }

            if (item.key === "rejected") {
                item.fill = "var(--color-rejected)";
            }

            return item;
        })
    );

    const totalOrders = React.useMemo(() => {
        return chartData.reduce((acc: any, curr: any) => acc + curr.orders, 0);
    }, []);

    return (
        <Chart
            title="Total orders for the month"
            description={categoriesOrderCharts.month}
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
                    dataKey="orders"
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
                                            {totalOrders.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Orders
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
