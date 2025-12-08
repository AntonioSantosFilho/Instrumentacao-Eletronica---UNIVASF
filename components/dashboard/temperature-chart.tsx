"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { useMemo } from "react"

interface TemperatureChartProps {
  data: Array<{ temperature: number; timestamp: string }>
  minTemp?: number
  maxTemp?: number
}

export function TemperatureChart({ data, minTemp = 2, maxTemp = 8 }: TemperatureChartProps) {
  const chartData = useMemo(() => {
    return data
      .map((item) => {
        return {
          ...item,
          timestamp: new Date(item.timestamp).getTime(),
          time: new Date(item.timestamp).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          fullTime: new Date(item.timestamp).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }),
        }
      })
      .slice(-50) // Últimos 50 pontos para melhor visualização
  }, [data])

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [-5, 15]
    const temps = chartData.map((d) => d.temperature)
    const min = Math.min(...temps) - 1
    const max = Math.max(...temps) + 1
    return [Math.floor(min), Math.ceil(max)]
  }, [chartData])

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (chartData.length === 0) return null
    const temps = chartData.map((d) => d.temperature)
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length
    const min = Math.min(...temps)
    const max = Math.max(...temps)
    return { avg: avg.toFixed(1), min: min.toFixed(1), max: max.toFixed(1) }
  }, [chartData])

  return (
    <Card className="bg-white border-[#D0D3D6] shadow-md">
      <CardHeader className="border-b border-[#D0D3D6]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#2E3438]">Histórico de Temperatura</CardTitle>
            <CardDescription className="text-[#2E3438]/70">
              Monitoramento das últimas 24 horas
            </CardDescription>
          </div>
          {stats && (
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="text-[#2E3438]/60 text-xs">Média</div>
                <div className="font-semibold text-[#2E3438]">{stats.avg}°C</div>
              </div>
              <div className="text-center">
                <div className="text-[#2E3438]/60 text-xs">Mín</div>
                <div className="font-semibold text-[#3B82F6]">{stats.min}°C</div>
              </div>
              <div className="text-center">
                <div className="text-[#2E3438]/60 text-xs">Máx</div>
                <div className="font-semibold text-[#EF4444]">{stats.max}°C</div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            temperature: {
              label: "Temperatura",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
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
                    hour: "2-digit",
                    minute: "2-digit"
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
                domain={yDomain}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°C`}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const temp = data.temperature
                    
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[0.70rem] uppercase text-muted-foreground font-semibold">
                              Temperatura
                            </span>
                            <span className="text-lg font-bold text-[#0057B8]">
                              {temp.toFixed(1)}°C
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {data.fullTime}
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#0057B8"
                strokeWidth={3}
                fill="url(#tempGradient)"
                fillOpacity={0.6}
                dot={false}
                activeDot={{ 
                  r: 7, 
                  fill: "#0057B8",
                  stroke: "#ffffff",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
