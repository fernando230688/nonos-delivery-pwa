-- Crear tabla de categorías
CREATE TABLE public.restodelivery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de productos
CREATE TABLE public.restodelivery_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.restodelivery_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de clientes
CREATE TABLE public.restodelivery_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de pedidos
CREATE TABLE public.restodelivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.restodelivery_customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de items de pedido
CREATE TABLE public.restodelivery_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.restodelivery_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.restodelivery_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.restodelivery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restodelivery_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restodelivery_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restodelivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restodelivery_order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público para lectura (categorías y productos)
CREATE POLICY "Cualquiera puede ver categorías"
  ON public.restodelivery_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede ver productos"
  ON public.restodelivery_products
  FOR SELECT
  USING (true);

-- Políticas para pedidos (cualquiera puede crear)
CREATE POLICY "Cualquiera puede crear pedidos"
  ON public.restodelivery_orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede ver sus propios pedidos"
  ON public.restodelivery_orders
  FOR SELECT
  USING (true);

-- Políticas para items de pedido
CREATE POLICY "Cualquiera puede crear items de pedido"
  ON public.restodelivery_order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede ver items de pedido"
  ON public.restodelivery_order_items
  FOR SELECT
  USING (true);

-- Políticas para clientes
CREATE POLICY "Cualquiera puede crear clientes"
  ON public.restodelivery_customers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede ver clientes"
  ON public.restodelivery_customers
  FOR SELECT
  USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restodelivery_orders_updated_at
  BEFORE UPDATE ON public.restodelivery_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar rendimiento
CREATE INDEX idx_products_category ON public.restodelivery_products(category_id);
CREATE INDEX idx_products_featured ON public.restodelivery_products(is_featured);
CREATE INDEX idx_orders_status ON public.restodelivery_orders(status);
CREATE INDEX idx_orders_created ON public.restodelivery_orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.restodelivery_order_items(order_id);

-- Habilitar realtime para pedidos
ALTER PUBLICATION supabase_realtime ADD TABLE public.restodelivery_orders;