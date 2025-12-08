"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import { useMemo } from "react"

interface TouchChartProps {
    data: Array<{ value: number; timestamp: string }>
}

export function TouchChart({ data }: TouchChartProps) {
    // Preparar dados para o gráfico de linha com marcadores nos toques
    const chartData = useMemo(() => {
        const touches = data
            .filter(item => item.value === 1) // Apenas toques (value = 1)
            .map((item) => {
                const date = new Date(item.timestamp)
                return {
                    timestamp: date.getTime(),
                    time: date.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    fullTime: date.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }),
                    value: 1,
                }
            })
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-50) // Últimos 50 toques

        return touches
    }, [data])

    if (data.length === 0) {
        return (
            <Card className="bg-white border-[#D0D3D6] shadow-md">
                <CardHeader className="border-b border-[#D0D3D6]">
                    <CardTitle className="text-[#2E3438]">Histórico de Toques</CardTitle>
                    <CardDescription className="text-[#2E3438]/70">Monitoramento de interação</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-[#2E3438]/60">
                        Nenhum dado disponível
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white border-[#D0D3D6] shadow-md">
            <CardHeader className="border-b border-[#D0D3D6]">
                <CardTitle className="text-[#2E3438]">Momentos de Interação</CardTitle>
                <CardDescription className="text-[#2E3438]/70">
                    Registro temporal dos últimos toques com data e hora ({chartData.length} toques registrados)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        value: {
                            label: "Toque",
                            color: "hsl(var(--chart-5))",
                        },
                    }}
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                            data={chartData} 
                            margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#D0D3D6" strokeOpacity={0.3} />
                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(timestamp) => {
                                    const date = new Date(timestamp)
                                    return date.toLocaleString("pt-BR", { 
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })
                                }}
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                domain={[0, 1.5]}
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={() => ""}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload
                                        return (
                                            <div className="rounded-lg border bg-background p-3 shadow-md">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground font-semibold">
                                                        Toque Registrado
                                                    </span>
                                                    <span className="text-sm font-bold text-[#EC4899]">
                                                        {data.fullTime}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#EC4899"
                                strokeWidth={2}
                                dot={{ 
                                    r: 6, 
                                    fill: "#EC4899",
                                    strokeWidth: 2,
                                    stroke: "#ffffff"
                                }}
                                activeDot={{ 
                                    r: 8, 
                                    fill: "#EC4899",
                                    strokeWidth: 3,
                                    stroke: "#ffffff"
                                }}
                                connectNulls={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
