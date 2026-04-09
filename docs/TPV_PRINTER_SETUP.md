# Vretti 80mm - Setup Rapido (USB/LAN)

## Alcance

Esta integracion imprime tickets de pedido desde la web (no procesa cobros con tarjeta).

## Flujo implementado

1. En admin, abre una orden.
2. En acciones, pulsa `Imprimir ticket`.
3. Se abre una vista de ticket termico 80mm.
4. El navegador lanza `window.print()` automaticamente.

## Ruta de impresion

- `/admin/orders/print/[orderId]`

## Configuracion recomendada (Windows)

1. Instala el driver de Vretti.
2. Conecta la impresora por USB.
3. En `Dispositivos e impresoras`:
   - Tamano de papel: 80mm (recibo)
   - Margenes: minimos
   - Corte automatico: activado (si el driver lo permite)
4. En Chrome/Edge al imprimir:
   - Destino: Vretti
   - Escala: 100%
   - Margenes: Ninguno
   - Cabeceras y pies: desactivado

## Flujo end-to-end en Windows

1. El pedido entra en el panel admin (delivery o local).
2. El sistema detecta nuevos pedidos segun el modo activo de auto-impresion.
3. Se abre la ruta de ticket termico correspondiente.
4. La vista de ticket dispara `window.print()` automaticamente.
5. Windows muestra el dialogo de impresion con la Vretti como destino.
6. Se imprime ticket 80mm y, si el driver lo soporta, realiza corte automatico.

## Checklist de validacion (Windows)

### Paso 1: verificar rutas de impresion

1. Ruta de pedidos locales: `/admin/orders/print/[orderId]`.
2. Ruta de pedidos delivery: `/admin/delivery/print/[deliveryOrderId]`.
3. Abre ambas rutas con un id real y confirma que renderizan ticket en formato 80mm.

### Paso 2: verificar auto-impresion en dashboard

1. Abre `Admin > Dashboard > Pedidos`.
2. Activa el toggle `Auto-Imprimir`.
3. Crea o sincroniza un pedido nuevo de Glovo/Uber/Deliveroo.
4. Espera el ciclo (aprox. 15-20 segundos).
5. Debe abrirse automaticamente el dialogo de impresion.

### Paso 3: verificar auto-impresion en panel de pedidos

1. Abre `Admin > Mis Pedidos`.
2. Activa el toggle `Imprenta Automatica`.
3. Selecciona modo `PAGADOS` o `TODOS`.
4. Genera un pedido nuevo y valida que salta la impresion automatica.

### Paso 4: validar configuracion de impresora en Windows

1. En Windows, confirma que la impresora aparece como disponible.
2. Papel configurado en 80mm (recibo).
3. Margenes minimos en driver y navegador.
4. Sin cabeceras ni pies del navegador.
5. Escala fija al 100%.

### Paso 5: testing de impresion manual

1. Desde una orden real, pulsa `Imprimir ticket` manualmente.
2. Confirma que el ticket sale con:
   - Nombre de productos legible.
   - Totales correctos.
   - Fecha/hora visibles.
   - Sin recortes laterales.
3. Repite con al menos 1 pedido local y 1 pedido delivery.

## Criterios de aceptacion para Windows

1. La impresion automatica se dispara sin accion manual tras detectar pedido nuevo.
2. La impresion manual funciona en cualquier pedido desde admin.
3. El formato 80mm sale consistente (sin zoom incorrecto ni saltos raros).
4. El flujo funciona igual en Chrome y Edge.

## Troubleshooting rapido (Windows)

1. No aparece el dialogo de impresion:
   - Verifica que no haya bloqueo de ventanas emergentes.
   - Revisa que la ruta de ticket carga correctamente.
2. Sale impresora incorrecta:
   - En el dialogo, fija Vretti como destino por defecto.
3. Ticket cortado o muy pequeno:
   - Revisa papel 80mm, escala 100% y margenes en ninguno/minimos.
4. No imprime en auto pero si en manual:
   - Revisa el toggle activo y el modo de filtrado (`PAGADOS`/`TODOS`).

## Configuracion recomendada (Mac)

1. Anade la impresora en `Configuracion del Sistema > Impresoras`.
2. Crea/selecciona papel de 80mm.
3. En el dialogo de impresion:
   - Escala 100%
   - Sin cabecera/pie
   - Margenes minimos

## LAN opcional

Si conectas por LAN, instala la impresora por IP en el sistema operativo.
La web sigue imprimiendo via dialogo del navegador al destino instalado.

## Nota de arquitectura

El frontend desplegado en Vercel no puede abrir un USB del servidor.
Por eso la impresion se ejecuta en el equipo local del restaurante mediante el navegador.
