import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { usePage } from "@inertiajs/react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
const chartConfig = {
    traffic: {
        label: "Traffics",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

const TotalTraffic = () => {
    const { totalTrafficsChart } = usePage().props;

    const [chartData] = React.useState<TotalTrafficsChart[]>(() =>
        totalTrafficsChart.map((item) => {
            if (item.name === "traffic") {
                item.fill = "var(--color-traffic)";
            }
            return item;
        })
    );

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.traffics, 0);
    }, []);

    return (
        <div className="w-full">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="traffics"
                        nameKey="name"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
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
                                                {totalVisitors.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Traffics
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
    );
};

export default TotalTraffic;
