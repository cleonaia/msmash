# 🎨 M SMASH BURGER — GUÍA DE DISEÑO OFICIAL

**Creado:** 2 de abril de 2026
**Versión:** 1.0
**Dirección de arte:** Graffiti urbano, estilo cartel retro con toques neón

---

## 🎨 PALETA DE COLORES

```
Fondo morado graffiti      #3A1F4A (elegancia oscura)
Panel negro carbón         #0F0F12 (contraste absoluto)
Texto crema               #F5F0E6 (legibilidad cálida)
Acento turquesa neón      #23C7C9 (energía futura)
Acento queso/naranja      #F59A23 (calidez precio)
Amarillo brillo           #FFD34D (detalles destacados)
Contorno/sombra           #000000 (70-90% opacidad)
Blanco secundario          #FFFFFF (solo fondos limpios)
```

---

## 🔤 TIPOGRAFÍAS (Google Fonts)

| Uso | Fuente | Peso | Tamaño (web) |
|-----|--------|------|--------------|
| Categorías/Títulos | Bangers | 400 | 36-48px |
| Nombres producto | Bebas Neue | 400 | 28-32px |
| Descripciones | Inter | 400 | 14-16px |
| Alérgenos | Inter | 500 | 12px |
| Precios | Bebas Neue | 700 | 24-28px |

**Import en HTML:**
```html
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Bebas+Neue&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## 📐 DIMENSIONES & ESPACIADO

### Instagram Post (1080×1350px)
```
Márgenes: 80px (todos)
Contenido útil: 920×1190px
Grid: 2 columnas
Gap entre elementos: 32px
Altura tarjeta producto: 280px
```

### Instagram Stories (1080×1920px)
```
Márgenes: 60px
Máximo 5 tarjetas por story
Altura reducida: 200px
```

### PDF A4 (210×297mm / 1920×2640px a 300 dpi)
```
Márgenes: 15mm
Columnas: 2 (ancho: 90mm cada una)
Gap: 10mm
```

### Web (Responsive)
```
Desktop: 3 columnas
Tablet: 2 columnas
Móvil: 1 columna
Tarjeta: width 100%, height auto
```

---

## 🎴 COMPONENTES DE DISEÑO

### 1. BARRA DE CATEGORÍA
```
Fondo: #23C7C9 (turquesa neón)
Texto: #0F0F12 (negro carbón)
Padding: 12px 24px
Border radius: 8px
Fuente: Bangers, 28px, bold
Efecto: sombra negra 4px offset abajo
Ejemplo: "BURGERS"
```

### 2. TARJETA DE PRODUCTO
```
Fondo: #0F0F12 (negro carbón)
Borde: 2px sólido #23C7C9 (turquesa)
Padding: 20px
Border radius: 12px
Sombra: 0 8px 16px rgba(0,0,0,0.7)

Estructura interior:
┌─────────────────────────┐
│ NOMBRE PRODUCTO         │ (Bebas Neue, 24px, crema)
│ 12,00€                  │ (Bebas Neue, 20px, naranja en cápsula)
│                         │
│ Descripción del         │ (Inter, 14px, crema 80%)
│ producto en 2 líneas    │
│                         │
│ [Gluten] [Lácteos]      │ (chips pequeños)
└─────────────────────────┘
```

### 3. CÁPSULA DE PRECIO
```
Fondo: #F59A23 (naranja queso)
Texto: #0F0F12 (negro)
Padding: 8px 16px
Border radius: 20px
Fuente: Bebas Neue, 18px, bold
Sombra: 0 4px 8px rgba(245,154,35,0.3)
Ancho: fit-content
```

### 4. CHIP DE ALÉRGENO
```
Fondo: #F5F0E6 (crema)
Borde: 1.5px sólido #23C7C9 (turquesa)
Texto: #0F0F12 (negro)
Padding: 6px 12px
Border radius: 16px
Fuente: Inter, 12px, medium
Estilo: inline-block, gap 8px
Ejemplos: "Gluten", "Lácteos", "Huevos", "Mostaza", "Soja"
```

### 5. EFECTO GRAFFITI (Sutil)
```
- Salpicaduras pequeñas: turquesa (#23C7C9) con 30% opacidad
- Ubicación: esquinas superiores y laterales
- Tamaño: 20-40px
- Herramienta Canva: usa brushes "spray" o créalas como PNG
- Alternativa: usa SVG con paths irregulares
```

### 6. SEPARADOR
```
Línea de 2px
Color: #F59A23 (naranja) con 50% opacidad
Altura: 40px (centrado)
Efecto: puede ser ondeado suave
```

---

## 📏 ESTRUCTURA VISUAL

### Layout Instagram Post 1 (BURGERS + ENTRANTES)
```
┌──────────────────────────────────────────┐
│                                          │
│  [M SMASH Logo - centrado]               │
│                                          │
│  CARTA                                   │
│  @msmashburguer                          │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  [BURGERS] (barra turquesa)              │
│  ┌─────────────┐  ┌─────────────┐       │
│  │ THE CRISPY  │  │ THE M SMASH │       │
│  │ 11,00€      │  │ 13,00€      │       │
│  │ Desc...     │  │ Desc...     │       │
│  │ [Alerg]     │  │ [Alerg]     │       │
│  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐       │
│  │ THE BASIC   │  │ SUPER CRISPY│       │
│  │ 6,50€       │  │ 11,90€      │       │
│  │ Desc...     │  │ Desc...     │       │
│  │ [Alerg]     │  │ [Alerg]     │       │
│  └─────────────┘  └─────────────┘       │
│                                          │
│  [ENTRANTES] (barra turquesa)            │
│  ┌─────────────┐  ┌─────────────┐       │
│  │ TEQUEÑOS    │  │ FRIES M     │       │
│  │ 5,00€       │  │ 7,00€       │       │
│  │ [Alerg]     │  │ [Alerg]     │       │
│  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐                        │
│  │CRISPY CHICK │                        │
│  │ 6,00€       │                        │
│  │ [Alerg]     │                        │
│  └─────────────┘                        │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  Síguenos: @msmashburguer                │
│  📍 Terrassa · 937 84 12 55             │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🎬 INSTRUCCIONES PARA CANVA

### Paso 1: Crear documento
1. Abre **Canva Pro** (si no tienes, usa la versión gratis)
2. Elige **"Crear diseño personalizado"**
3. Dimensiones: **1080 × 1350 px** (Instagram post)
4. Fondo: **#3A1F4A** (morado graffiti)

### Paso 2: Agregar elementos
1. **Header:**
   - Inserta tu logo M SMASH (centrado, 120px)
   - Texto: "CARTA" (Bangers, 48px, #F5F0E6)
   - Texto pequeño: "@msmashburguer" (Inter, 14px, #F59A23)

2. **Primera barra de categoría:**
   - Rectángulo redondeado: #23C7C9, padding 12-24px
   - Texto: "BURGERS" (Bangers, 36px, #0F0F12)
   - Sombra: 0 4px 8px negro

3. **Grid de tarjetas:**
   - 4 tarjetas en grid 2×2
   - Cada tarjeta: #0F0F12, borde 2px #23C7C9, radio 12px

4. **Dentro de cada tarjeta:**
   - Nombre: Bebas Neue, 24px, #F5F0E6
   - Precio en cápsula: #F59A23, texto #0F0F12
   - Descripción: Inter, 14px, #F5F0E6 (80% opacidad)
   - Alérgenos: chips crema con borde turquesa

5. **Efecto graffiti:**
   - En Canva, busca "salpicadura" o "spray"
   - Coloca en esquinas (turquesa #23C7C9, 30% opacidad)
   - Tamaño: 30-50px

6. **Footer:**
   - "Síguenos: @msmashburguer"
   - Tamaño: Inter, 14px, #F59A23

### Paso 3: Exportar
- **Para redes:** PNG a 300 dpi
- **Para imprenta:** PDF a 300 dpi
- **Web:** JPG a 72 dpi optimizado

---

## 🖼️ INSTRUCCIONES PARA FIGMA

### Paso 1: Crear proyecto
1. Frame: 1080 × 1350 px
2. Fondo: color #3A1F4A

### Paso 2: Instalar fonts
- Instalá: Bangers, Bebas Neue, Inter desde Google Fonts
- En Figma: haz clic en "tipografía" → "importar custom fonts"

### Paso 3: Crear componentes reutilizables
```
Components:
├── Card/Product
│   ├── CardDefault
│   ├── CardDrink (más compacta)
│   └── CardCategory
├── Button/CategoryBar
├── Badge/Allergen
└── Decoration/Splat
```

### Paso 4: Usar componentes
- Duplica tarjetas (no copies, usa componentes)
- Todos los cambios se sincronizan automáticamente

### Paso 5: Exportar
- Frame principal → Export → PNG 1x (para web)
- Sistema → Export → PDF (para imprenta)

---

## ⏱️ VERSIÓN RÁPIDA (30 minutos en Canva)

Si tienes prisa, usa esta alternativa simplificada:
1. Olvida los graffitis (los chips de alérgenos los reemplazan)
2. Usa sombras simples (1-2 capas)
3. Tarjetas planas sin efectos extra
4. Paleta misma, tipografías mismas
5. Resultado: 80% del impacto, 20% del tiempo

---

## ✅ CHECKLIST DE DISEÑO

- [ ] Colores exactos según paleta
- [ ] Tipografías instaladas correctamente
- [ ] Márgenes: 80px Instagram, 15mm PDF
- [ ] Tarjetas: borde turquesa 2px
- [ ] Precios: cápsula naranja
- [ ] Alérgenos: chips crema con borde
- [ ] Sombras: negras con 70% opacidad
- [ ] Espaciado: 32px entre elementos
- [ ] Sin texto pixelado (300 dpi mínimo)
- [ ] Logo centrado y proporcionado

---

## 💾 EXPORTAR CORRECTAMENTE

### Para Instagram:
```
Formato: PNG
Resolución: 1080×1350px
Color: RGB
Tipo: Interlaced
Compresión: máxima
```

### Para PDF (imprenta):
```
Formato: PDF
Resolución: 300 dpi
Color: CMYK (si es imprenta profesional)
Márgenes: incluidos en el diseño
```

### Para Web:
```
Formato: WebP o JPG
Resolución: 72 dpi
Ancho: 1080px máximo
Compresión: optimizada (<200KB)
```

---

## 🎯 DIFERENCIADOR: Tu Estilo Único

**Por qué es diferente a la competencia:**
1. **Graffiti urbano** (Qamarero es limpio/corporativo)
2. **Colores neón** (Qamarero usa gris/azul pasado)
3. **Cartelería retro** (Qamarero es digital)
4. **Tipografías display** (Qamarero usa sans-serif estándar)
5. **Alérgenos claros** (Qamarero no los destaca)

**Resultado:** Visual joven, accesible, memorable. Vende mejor en redes.

---

## 📞 SIGUIENTE PASO

1. Si usas Canva: sigue la "Guía Canva" arriba
2. Si usas Figma: sigue la "Guía Figma" arriba
3. Si quieres componentes React web: pide el archivo `MenuCarteProfessional.tsx`
4. Si quieres PDF generado automático: pide el archivo `generate-carta-pdf.ts`

---

**Diseño listo para usar. ¡Crea en Canva/Figma ahora! 🎨**
