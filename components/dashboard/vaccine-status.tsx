import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, MapPin, Activity, ShieldCheck } from "lucide-react"

interface VaccineStatusProps {
    temperature?: number
    location?: { lat: number; lng: number }
    lastUpdate?: string
    status?: "normal" | "warning" | "critical"
}

export function VaccineStatus({ temperature, location, lastUpdate, status = "normal" }: VaccineStatusProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temperatura Atual</CardTitle>
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {temperature ? `${Number(temperature).toFixed(1)}°C` : "--"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Monitoramento em tempo real
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status da Vacina</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {status === "normal" && <span className="text-green-500">Seguro</span>}
                        {status === "warning" && <span className="text-yellow-500">Atenção</span>}
                        {status === "critical" && <span className="text-red-500">Crítico</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Condições de transporte
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Localização</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Em Trânsito</div>
                    <p className="text-xs text-muted-foreground">
                        Rastreamento ativo
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Integridade</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">100%</div>
                    <p className="text-xs text-muted-foreground">
                        Nenhuma violação detectada
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
