"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface GPSMapProps {
  location: { latitude: number; longitude: number } | null
  history?: Array<{ latitude: number; longitude: number; timestamp?: string }>
}

export function GPSMap({ location, history = [] }: GPSMapProps) {
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])
  const [isClient, setIsClient] = useState(false)

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || !location) return

    // Carregar Leaflet dinamicamente apenas no cliente
    import("leaflet").then((L) => {
      // Fix para ícones padrão do Leaflet no Next.js
      delete (L.default.Icon.Default.prototype as any)._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      // Importar CSS do Leaflet
      import("leaflet/dist/leaflet.css")

      // Inicializar mapa apenas uma vez
      if (!mapRef.current) {
        mapRef.current = L.default.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        })

        // Adicionar tile layer (OpenStreetMap)
        L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current)
      }

      const map = mapRef.current

      // Limpar marcadores anteriores
      markersRef.current.forEach((marker) => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      })
      markersRef.current = []

      // Adicionar marcador da localização atual
      const lat = Number(location.latitude)
      const lng = Number(location.longitude)
      
      const currentMarker = L.default.marker([lat, lng], {
        icon: L.default.icon({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(map)
        .bindPopup(`<b>Localização Atual</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)

      markersRef.current.push(currentMarker)

      // Adicionar marcadores do histórico
      if (history.length > 0) {
        history.slice(0, 10).forEach((pos, index) => {
          const posLat = Number(pos.latitude)
          const posLng = Number(pos.longitude)
          
          const historyMarker = L.default.circleMarker([posLat, posLng], {
            radius: 5,
            fillColor: "#3B82F6",
            color: "#1E40AF",
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0.5,
          })
            .addTo(map)
            .bindPopup(
              `<b>Posição ${index + 1}</b><br>Lat: ${posLat.toFixed(6)}<br>Lng: ${posLng.toFixed(6)}${pos.timestamp ? `<br>${new Date(pos.timestamp).toLocaleString("pt-BR")}` : ""}`
            )

          markersRef.current.push(historyMarker)
        })

        // Adicionar linha conectando os pontos do histórico
        if (history.length > 1) {
          const latlngs = history.map((pos) => [Number(pos.latitude), Number(pos.longitude)] as [number, number])
          const polyline = L.default.polyline(latlngs, {
            color: "#3B82F6",
            weight: 2,
            opacity: 0.5,
            dashArray: "5, 5",
          }).addTo(map)

          markersRef.current.push(polyline)
        }
      }

      // Centralizar mapa na localização atual
      map.setView([lat, lng], 13)
    })

    // Cleanup apenas quando o componente for desmontado
    return () => {
      if (mapRef.current) {
        markersRef.current.forEach((marker) => {
          if (mapRef.current?.hasLayer(marker)) {
            mapRef.current.removeLayer(marker)
          }
        })
        markersRef.current = []
      }
    }
  }, [isClient, location, history])

  // Cleanup do mapa quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <Card className="bg-white border-[#D0D3D6] shadow-md">
      <CardHeader className="border-b border-[#D0D3D6]">
        <CardTitle className="flex items-center gap-2 text-[#2E3438]">
          <MapPin className="h-5 w-5 text-[#0057B8]" />
          Localização GPS
        </CardTitle>
        <CardDescription className="text-[#2E3438]/70">Rastreamento em tempo real do transporte</CardDescription>
      </CardHeader>
      <CardContent>
        {location ? (
          <div className="space-y-4">
            {/* Mapa Leaflet */}
            <div
              ref={mapContainerRef}
              className="w-full h-[400px] rounded-lg overflow-hidden border border-[#D0D3D6]"
              style={{ position: "relative", zIndex: 0 }}
            />

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#F4F6F8] rounded-lg border border-[#D0D3D6]">
                <p className="text-xs text-[#2E3438]/70 mb-1 font-medium">Latitude</p>
                <p className="font-mono text-sm font-semibold text-[#0057B8]">{Number(location.latitude).toFixed(6)}</p>
              </div>
              <div className="p-3 bg-[#F4F6F8] rounded-lg border border-[#D0D3D6]">
                <p className="text-xs text-[#2E3438]/70 mb-1 font-medium">Longitude</p>
                <p className="font-mono text-sm font-semibold text-[#0057B8]">{Number(location.longitude).toFixed(6)}</p>
              </div>
            </div>

            {/* Histórico de posições */}
            {history.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#2E3438] mb-2">Últimas posições:</p>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {history.slice(0, 5).map((pos, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-[#F4F6F8] rounded border border-[#D0D3D6]">
                      <span className="font-mono text-[#0057B8]">
                        {Number(pos.latitude).toFixed(4)}, {Number(pos.longitude).toFixed(4)}
                      </span>
                      <span className="text-[#2E3438]/70">
                        {pos.timestamp ? new Date(pos.timestamp).toLocaleTimeString("pt-BR") : "--:--"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-[#2E3438]/60">
            <MapPin className="h-12 w-12 mb-2 opacity-50 text-[#D0D3D6]" />
            <p className="font-medium">Localização não disponível</p>
            <p className="text-xs mt-1">Aguardando dados do GPS</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
