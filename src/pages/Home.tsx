import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_featured: boolean;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    const { data } = await supabase
      .from('restodelivery_products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .limit(6);

    if (data) setFeaturedProducts(data);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-fire" />
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=500&fit=crop"
          alt="Parrilla Los Nonos"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="relative h-full flex items-center justify-center text-white text-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              ¡Bienvenido a Los Nonos!
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Parrilla casera en Banfield. 20 años haciendo las mejores carnes 🔥
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                  Ver Menú Completo
                </Button>
              </Link>
              <a href="https://wa.me/5491123017690" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  Hacer Pedido
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 -mt-20 relative z-10">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-bold mb-2">Ubicación</h3>
              <p className="text-sm text-muted-foreground">
                Melo 720<br />
                Entre Lugano y Levalle<br />
                Banfield
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Clock className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-bold mb-2">Horarios</h3>
              <p className="text-sm text-muted-foreground">
                Jueves y Viernes: Cena<br />
                Sábado y Domingo: Almuerzo y Cena
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Instagram className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-bold mb-2">Seguinos</h3>
              <a 
                href="https://instagram.com/losnonos_1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                @losnonos_1
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                ¡Mirá nuestras delicias!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Recomendados del Día</h2>
                <p className="text-muted-foreground">Nuestras especialidades imperdibles</p>
              </div>
              <Link to="/menu">
                <Button variant="outline">Ver Todo</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {/* Promo Section */}
        <Card className="bg-gradient-gold text-accent-foreground mb-12 overflow-hidden">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-3">🎉 Promo Especial</h2>
            <p className="text-xl mb-4">
              ¡Docena de Empanadas + Gaseosa de 2L!
            </p>
            <p className="text-4xl font-bold mb-6">$25.000</p>
            <Link to="/menu">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Pedir Ahora
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* About Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Tradición Familiar</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Con más de 20 años de experiencia, en Los Nonos te recibimos como familia. 
            Nuestra parrilla y platos caseros están hechos con amor, como en la casa de la abuela. 
            Cada asado, cada milanesa, cada empanada tiene el sabor auténtico de la cocina argentina.
          </p>
          <div className="text-2xl mb-2">🔥🍖🇦🇷</div>
          <p className="text-lg font-semibold text-primary">
            Siempre es un buen día para comer algo rico
          </p>
        </section>
      </div>
    </div>
  );
}
