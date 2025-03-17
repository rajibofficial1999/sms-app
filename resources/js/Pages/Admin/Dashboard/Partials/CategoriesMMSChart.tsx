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
    count: {
        label: "MMS",
    },
    sent: {
        label: "Outgoing",
        color: "hsl(var(--chart-2))",
    },
    received: {
        label: "Incoming",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CategoriesMMSChart() {
    const { categoriesMMS } = usePage<PageProps<any>>().props;

    const [chartData] = React.useState(() =>
        categoriesMMS.data.map((item: any) => {
            if (item.key === "sent") {
                item.fill = "var(--color-sent)";
            }
            if (item.key === "received") {
                item.fill = "var(--color-received)";
            }
            return item;
        })
    );

    const totalSMS = React.useMemo(() => {
        return chartData.reduce((acc: any, curr: any) => acc + curr.count, 0);
    }, []);

    return (
        <Chart
            title="Total MMS for the month"
            description={categoriesMMS.month}
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
                    dataKey="count"
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
                                            {totalSMS.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Total MMS
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
