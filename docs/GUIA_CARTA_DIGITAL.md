# 📸 Guía de Implementación - Carta Digital

Este documento explica cómo usar los nuevos componentes de carta del M SMASH.

## Componentes Creados

### 1. **MenuCatalog** - Vista Web Completa
Localización: `src/components/menu/MenuCatalog.tsx`

Funcionalidad:
- ✅ Visualización en grid 3 columnas
- ✅ Filtros por categoría (sticky)
- ✅ Muestra nombre, descripción, precio y alérgenos
- ✅ Visual responsive
- ✅ Badges de "Favorito" y categoría

Uso:
```tsx
import { MenuCatalog } from '@/components/menu/MenuCatalog';

export default function MenuPage() {
  return <MenuCatalog />;
}
```

---

### 2. **MenuPDFExport** - Descarga PDF + Impresión
Localización: `src/components/menu/MenuPDFExport.tsx`

Funcionalidad:
- ✅ Genera PDF descargable profesional
- ✅ Organiza por categorías
- ✅ Incluye alérgenos
- ✅ Pronto para imprimir (A4)
- ✅ Footer con fecha

Uso:
```tsx
import { MenuPDFExport } from '@/components/menu/MenuPDFExport';

export default function PrintPage() {
  return <MenuPDFExport />;
}
```

API Endpoint: `POST /api/menu/generate-pdf`

---

### 3. **InstagramMenuCards** - Para Redes Sociales
Localización: `src/components/menu/InstagramMenuCards.tsx`

Funcionalidad:
- ✅ Tarjetas optimizadas para Instagram
- ✅ Imagen grande + descripción
- ✅ Botón compartir
- ✅ Display de alérgenos destacados

Uso:
```tsx
import { InstagramMenuCards } from '@/components/menu/InstagramMenuCards';

export default function SocialPage() {
  return <InstagramMenuCards />;
}
```

---

## Agregar Imágenes a los Productos

### Opción 1: Rutas locales (Recomendado)

1. **Crea la carpeta de imágenes:**
   ```bash
   mkdir -p public/images/products
   ```

2. **Copia tus imágenes en:**
   ```
   public/images/products/
   ├── the-crispy.jpg
   ├── the-m-smash.jpg
   ├── the-basic.jpg
   ├── the-super-crispy.jpg
   ├── menu-kids.jpg
   ├── frankfurt.jpg
   ├── tequeños.jpg
   ├── fries-m.jpg
   ├── crispy-chicken.jpg
   ├── cheesecake-nutella.jpg
   ├── pepsi-clasica.jpg
   ├── lipton.jpg
   ├── pepsi-zero.jpg
   ├── sprite.jpg
   ├── schweppes-naranja.jpg
   ├── schweppes-limon.jpg
   ├── agua-solan.jpg
   └── agua-gas.jpg
   ```

3. **Las rutas ya están configuradas en `menu.ts`:**
   ```ts
   const THE_CRISPY = "/images/products/the-crispy.jpg";
   // ... etc
   ```

### Opción 2: URLs externas

Si prefieres usar Cloudinary o similar:

```ts
// En src/features/menu/data/menu.ts
const THE_CRISPY = "https://res.cloudinary.com/...";
```

---

## Integrar en la Web

### 1. Página de Menú
Archivo: `src/app/(public)/menu/page.tsx`

```tsx
import { MenuCatalog } from '@/components/menu/MenuCatalog';

export default function MenuPage() {
  return (
    <>
      <MenuCatalog />
    </>
  );
}
```

### 2. Descargar PDF
Archivo: `src/app/(public)/descargar-carta/page.tsx`

```tsx
import { MenuPDFExport } from '@/components/menu/MenuPDFExport';

export default function DownloadPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Descarga Nuestra Carta</h1>
      <MenuPDFExport />
    </div>
  );
}
```

### 3. Redes Sociales
Archivo: `src/app/(public)/redes/menu/page.tsx`

```tsx
import { InstagramMenuCards } from '@/components/menu/InstagramMenuCards';

export default function SocialMenuPage() {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-white py-12">
      <InstagramMenuCards />
    </div>
  );
}
```

---

## Publicar en Instagram

### Estrategia Recomendada:

1. **Stories (24h):**
   - Cada producto en historia individual
   - Usa las imágenes optimizadas
   - Añade sticker de precio
   - Incluye link "Pedir ahora"

2. **Feed (Permanente):**
   - Food styling profesional
   - Grupos de 3-4 productos por post
   - Carrusel con todos los detalles
   - Hashtags: #msmashburger #burgersperfectos #terrassa #foodporn

3. **Reels (Trending):**
   - Video del proceso de hacer un burger
   - Testimonios de clientes
   - Promociones semanales

4. **Highlights (Destacados):**
   - "MENÚ" - todos los productos
   - "PROMOCIONES" - ofertas
   - "PEDIDOS" - cómo pedir

---

## Base de Datos Actualizada

La información se encuentra en:
```
src/features/menu/data/menu.ts
```

**Todos los datos están estructurados y listos:**
- ✅ 5 Burguers
- ✅ 3 Entrantres
- ✅ 1 Frankfurt
- ✅ 8 Bebidas
- ✅ 1 Postre

**Con alérgenos exactos:**
- Gluten
- Lácteos
- Huevos
- Mostaza
- Soja

---

## Próximas Mejoras (Opcional)

- [ ] Integrar con Stripe para pago online
- [ ] Sistema de combos/ofertas
- [ ] Carrito persistente
- [ ] Filtro por alérgenos (para alérgicos)
- [ ] QR code en PDF
- [ ] Exportar a Excel para proveedores
- [ ] Versión en Inglés

---

## Soporte y Dudas

Si tienes preguntas sobre cómo usar estos componentes, revisa:
1. Los archivos `.tsx` están bien comentados
2. La estructura está en `src/features/menu/`
3. Las imágenes van en `public/images/products/`

¡Listo para usar! 🚀
