-- ==============================================================================
-- ESQUEMA MAESTRO SUPABASE: CD ALUMINIO (GRUPO AGN)
-- Proyecto: nzbksviozqkowttrvyuf (sa-east-1)
-- ==============================================================================

-- 1. TABLA: PRODUCTOS (Los 26 productos del catálogo oficial)
CREATE TABLE IF NOT EXISTS public.productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL, -- 'ventanas', 'puertas', 'mamparas', 'sistemas', 'especiales'
    permite_cotizacion_estandar BOOLEAN DEFAULT true,
    orden INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: SERIES / LINEAS
CREATE TABLE IF NOT EXISTS public.lineas_series (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT NOT NULL, -- 'estandar', 'alta_prestacion'
    orden INT DEFAULT 0
);

-- 3. TABLA: COMPATIBILIDAD PRODUCTO <-> SERIE (Matriz del Excel del cliente)
CREATE TABLE IF NOT EXISTS public.producto_series (
    producto_id TEXT REFERENCES public.productos(id) ON DELETE CASCADE,
    serie_id TEXT REFERENCES public.lineas_series(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, serie_id)
);

-- 4. TABLA: COLORES / TERMINACIONES
CREATE TABLE IF NOT EXISTS public.colores (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    hex TEXT NOT NULL,
    recargo_porcentaje NUMERIC(5,2) DEFAULT 0.00,
    orden INT DEFAULT 0
);

-- 5. TABLA: CRISTALES / VIDRIOS
CREATE TABLE IF NOT EXISTS public.cristales (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    recargo_porcentaje NUMERIC(5,2) DEFAULT 0.00,
    orden INT DEFAULT 0
);

-- 6. TABLA: MEDIDAS Y PRECIOS ESTÁNDAR
CREATE TABLE IF NOT EXISTS public.medidas_precios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id TEXT REFERENCES public.productos(id) ON DELETE CASCADE,
    serie_id TEXT REFERENCES public.lineas_series(id) ON DELETE CASCADE,
    ancho_mm INT NOT NULL,
    alto_mm INT NOT NULL,
    precio_base_natural NUMERIC(10,2), -- null si es 'A consultar / A convenir'
    precio_base_anolok NUMERIC(10,2),
    activo BOOLEAN DEFAULT true
);

-- 7. TABLA: REGISTRO HISTÓRICO DE PRESUPUESTOS (Para n8n / Seguimiento)
CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_presupuesto TEXT UNIQUE NOT NULL,
    cliente_nombre TEXT,
    cliente_telefono TEXT,
    producto_nombre TEXT NOT NULL,
    serie_nombre TEXT NOT NULL,
    color_nombre TEXT NOT NULL,
    dimensiones TEXT NOT NULL, -- 'Ancho x Alto mm'
    cristal_nombre TEXT NOT NULL,
    con_colocacion BOOLEAN DEFAULT false,
    monto_total NUMERIC(10,2),
    estado TEXT DEFAULT 'emitido', -- 'emitido', 'senado', 'entregado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) con lectura pública para la App
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineas_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cristales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medidas_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para catálogo (anon key)
CREATE POLICY "Lectura pública de productos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de series" ON public.lineas_series FOR SELECT USING (true);
CREATE POLICY "Lectura pública de producto_series" ON public.producto_series FOR SELECT USING (true);
CREATE POLICY "Lectura pública de colores" ON public.colores FOR SELECT USING (true);
CREATE POLICY "Lectura pública de cristales" ON public.cristales FOR SELECT USING (true);
CREATE POLICY "Lectura pública de medidas_precios" ON public.medidas_precios FOR SELECT USING (true);

-- Política de inserción de cotizaciones (anon key puede guardar cotizaciones)
CREATE POLICY "Inserción pública de cotizaciones" ON public.cotizaciones FOR INSERT WITH CHECK (true);
