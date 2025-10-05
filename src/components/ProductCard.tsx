import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_featured?: boolean;
}

export const ProductCard = ({ id, name, description, price, image_url, is_featured }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id, name, price, image_url });
    toast.success(`${name} agregado al carrito`, {
      description: `$${price.toLocaleString('es-AR')}`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-glow transition-all duration-300 animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image_url ? (
          <img 
            src={image_url} 
            alt={name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-wood">
            <span className="text-4xl">🍖</span>
          </div>
        )}
        {is_featured && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Destacado
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${price.toLocaleString('es-AR')}
          </span>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="bg-gradient-fire hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
