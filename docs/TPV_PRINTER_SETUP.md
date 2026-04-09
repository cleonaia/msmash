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
