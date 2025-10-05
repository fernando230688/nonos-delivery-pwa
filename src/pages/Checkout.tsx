import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    try {
      // Crear cliente
      const { data: customer, error: customerError } = await supabase
        .from('restodelivery_customers')
        .insert({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Crear pedido
      const { data: order, error: orderError } = await supabase
        .from('restodelivery_orders')
        .insert({
          customer_id: customer.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          total,
          notes: formData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Crear items del pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('restodelivery_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Enviar mensaje por WhatsApp
      const message = `🔥 *Nuevo Pedido - Los Nonos*\n\n` +
        `*Cliente:* ${formData.name}\n` +
        `*Teléfono:* ${formData.phone}\n` +
        `*Dirección:* ${formData.address}\n\n` +
        `*Pedido:*\n` +
        items.map(item => `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString('es-AR')}`).join('\n') +
        `\n\n*Total: $${total.toLocaleString('es-AR')}*` +
        (formData.notes ? `\n\n*Notas:* ${formData.notes}` : '');

      const whatsappUrl = `https://wa.me/5491123017690?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast.success("¡Pedido realizado con éxito!");
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Carrito
        </Button>

        <h1 className="text-4xl font-bold mb-8">Finalizar Pedido</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {items.map(item => (
              <div key={item.id} className="flex justify-between py-2">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="11 2301 7690"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección de Entrega *</Label>
                <Textarea
                  id="address"
                  required
                  placeholder="Calle, número, piso, departamento"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Instrucciones especiales, alergias, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-fire text-lg h-12"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
