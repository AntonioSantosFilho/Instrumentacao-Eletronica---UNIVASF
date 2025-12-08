"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis,
} from "recharts"
import { useMemo } from "react"

interface TouchChartProps {
    data: Array<{ value: number; timestamp: string }>
}

export function TouchChart({ data }: TouchChartProps) {
    // Gráfico Temporal (Scatter plot para mostrar momentos exatos)
    const temporalData = useMemo(() => {
        return data
            .filter(item => item.value === 1) // Apenas toques (value = 1)
            .map((item) => ({
                time: new Date(item.timestamp).getTime(),
                formattedTime: new Date(item.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                y: 1, // Constante para alinhar no eixo Y
            }))
            .slice(-50)
    }, [data])

    // Gráfico de Contagem por Hora
    const countData = useMemo(() => {
        const counts: Record<string, number> = {}

        data.forEach((item) => {
            if (item.value === 1) {
                const date = new Date(item.timestamp)
                const hourKey = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                // Agrupar por hora cheia para simplificar
                const hour = date.getHours()
                const key = `${hour.toString().padStart(2, '0')}:00`
                counts[key] = (counts[key] || 0) + 1
            }
        })

        return Object.entries(counts)
            .map(([time, count]) => ({ time, count }))
            .sort((a, b) => a.time.localeCompare(b.time))
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
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Gráfico de Contagem */}
            <Card className="bg-white border-[#D0D3D6] shadow-md">
                <CardHeader className="border-b border-[#D0D3D6]">
                    <CardTitle className="text-[#2E3438]">Frequência de Toques</CardTitle>
                    <CardDescription className="text-[#2E3438]/70">Quantidade de toques por hora</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            count: {
                                label: "Toques",
                                color: "hsl(var(--chart-4))",
                            },
                        }}
                        className="h-[300px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#D0D3D6" strokeOpacity={0.3} />
                                <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Toques" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Gráfico Temporal (Momentos) */}
            <Card className="bg-white border-[#D0D3D6] shadow-md">
                <CardHeader className="border-b border-[#D0D3D6]">
                    <CardTitle className="text-[#2E3438]">Momentos de Interação</CardTitle>
                    <CardDescription className="text-[#2E3438]/70">Registro temporal dos últimos toques</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            y: {
                                label: "Interação",
                                color: "hsl(var(--chart-5))",
                            },
                        }}
                        className="h-[300px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#D0D3D6" strokeOpacity={0.3} />
                                <XAxis
                                    type="number"
                                    dataKey="time"
                                    domain={['auto', 'auto']}
                                    tickFormatter={(time) => new Date(time).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis type="number" dataKey="y" height={10} domain={[0, 2]} tick={false} axisLine={false} />
                                <ZAxis type="number" range={[100, 100]} />
                                <ChartTooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                Horário
                                                            </span>
                                                            <span className="font-bold text-muted-foreground">
                                                                {payload[0].payload.formattedTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Scatter name="Toques" data={temporalData} fill="#EC4899" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
