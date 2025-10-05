import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Package, Users, ShoppingBag, Clock } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  total: number;
  notes: string | null;
  created_at: string;
  restodelivery_order_items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      navigate("/");
      return;
    }

    loadOrders();
    
    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restodelivery_orders'
        },
        () => loadOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('restodelivery_orders')
        .select(`
          *,
          restodelivery_order_items (
            product_name,
            quantity,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('restodelivery_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast.success("Estado actualizado");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Error al actualizar estado");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      preparing: "bg-orange-500",
      delivering: "bg-purple-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      preparing: "En Preparación",
      delivering: "En Camino",
      completed: "Completado",
      cancelled: "Cancelado"
    };
    return labels[status] || status;
  };

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    return orders.filter(o => o.status === status);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'preparing', 'delivering'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="bg-gradient-fire text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Panel Administrativo</h1>
            <p className="opacity-90">Los Nonos - Gestión de Pedidos</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <ShoppingBag className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Proceso</p>
                  <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
                </div>
                <Package className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                </div>
                <Users className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pedidos */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="active">Activos</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {filterOrders().map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={updateOrderStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {filterOrders('pending').map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={updateOrderStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-6">
            {orders.filter(o => ['confirmed', 'preparing', 'delivering'].includes(o.status)).map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={updateOrderStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {filterOrders('completed').map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={updateOrderStatus}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

function OrderCard({ order, onStatusChange, getStatusColor, getStatusLabel }: OrderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.customer_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleString('es-AR')}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusLabel(order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">Contacto:</p>
            <p className="text-sm">{order.customer_phone}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Dirección:</p>
            <p className="text-sm">{order.customer_address}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Pedido:</p>
            {order.restodelivery_order_items.map((item, idx) => (
              <p key={idx} className="text-sm">
                {item.quantity}x {item.product_name} - ${(item.price * item.quantity).toLocaleString('es-AR')}
              </p>
            ))}
          </div>

          {order.notes && (
            <div>
              <p className="text-sm font-semibold">Notas:</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <div className="pt-3 border-t">
            <p className="text-lg font-bold text-primary">
              Total: ${order.total.toLocaleString('es-AR')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-3">
            {order.status === 'pending' && (
              <Button size="sm" onClick={() => onStatusChange(order.id, 'confirmed')}>
                Confirmar
              </Button>
            )}
            {order.status === 'confirmed' && (
              <Button size="sm" onClick={() => onStatusChange(order.id, 'preparing')}>
                En Preparación
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button size="sm" onClick={() => onStatusChange(order.id, 'delivering')}>
                En Camino
              </Button>
            )}
            {order.status === 'delivering' && (
              <Button size="sm" onClick={() => onStatusChange(order.id, 'completed')}>
                Completar
              </Button>
            )}
            {!['cancelled', 'completed'].includes(order.status) && (
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onStatusChange(order.id, 'cancelled')}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
