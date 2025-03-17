import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

const chartConfig = {
    trafic: {
        label: "Traffics",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

const DailyTrafficsChart = () => {
    const { trafficCharts: chartData } = usePage<PageProps<any>>().props;
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Daily traffics</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="max-h-60 w-full"
                    >
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 2)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent indicator="dashed" />
                                }
                            />
                            <Bar
                                dataKey="traffics"
                                fill="var(--color-trafic)"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default DailyTrafficsChart;
