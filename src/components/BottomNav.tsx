import { Home, UtensilsCrossed, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export const BottomNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  const links = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/menu", icon: UtensilsCrossed, label: "Menú" },
    { to: "/cart", icon: ShoppingCart, label: "Carrito", badge: itemCount },
    { to: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16">
        {links.map(({ to, icon: Icon, label, badge }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {badge && badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                    {badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
