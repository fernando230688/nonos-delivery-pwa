import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Phone, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Información de Contacto</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              <strong>Melo 720</strong><br />
              Entre Lugano y Levalle<br />
              Banfield, Buenos Aires
            </p>
            <a 
              href="https://maps.google.com/?q=Melo+720+Banfield"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-fire">
                Ver en Google Maps
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Jueves y Viernes:</strong> Solo Cena (19:00 - 00:00)</p>
            <p><strong>Sábados y Domingos:</strong> Almuerzo (12:00 - 16:00) y Cena (19:00 - 00:00)</p>
            <p className="text-sm text-muted-foreground mt-4">
              * Los horarios pueden variar en días festivos
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-2">WhatsApp</p>
              <a 
                href="https://wa.me/5491123017690"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-fire">
                  <Phone className="w-4 h-4 mr-2" />
                  11 2301-7690
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-primary" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Seguinos en Instagram para ver nuestras delicias diarias:</p>
            <a 
              href="https://instagram.com/losnonos_1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-fire">
                <Instagram className="w-4 h-4 mr-2" />
                @losnonos_1
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-3">¿Preguntas o Sugerencias?</h3>
            <p className="text-muted-foreground mb-4">
              Estamos para escucharte. Contactanos por WhatsApp y te responderemos a la brevedad.
            </p>
            <div className="text-3xl mb-2">🍖❤️</div>
            <p className="font-semibold text-primary">
              ¡Gracias por elegirnos!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
