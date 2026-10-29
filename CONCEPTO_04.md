# CPAUL — Concepto 04 / Cinematic Textile Lab

> Rama de revisión. **NO FUSIONAR NI PUBLICAR EN cpaul.store** hasta aprobación expresa.

## Objetivo
Landing institucional, no ecommerce ni catálogo. Basada en la composición y narrativa visual del video de referencia compartido por el cliente (50536.mp4): fondo técnico, objeto protagonista, profundidad, texto editorial, transiciones por scroll y despiece de materiales. No replica las marcas, modelos ni textos de terceros.

## Implementación actual
- Portada fijada durante el scroll con 3 capítulos (origen, materia, identidad).
- Producto protagonista con transformaciones tridimensionales CSS perspective, tilt por puntero y rotación con scroll; aros orbitales, retícula técnica y video ambiental.
- Cuatro paneles de servicios institucionales sin carrito ni precios.
- Despiece de cuatro capas textiles en perspectiva 3D, animadas por scroll, con selección manual.
- Video del proceso de bordado de referencia con control reproducir/pausar.
- Presentación editorial, aplicación de prendas de muestra y CTA hacia WhatsApp.
- Responsive, navegación accesible, indicadores, prefers-reduced-motion y control manual de animaciones.

## Archivos
- index.html — estructura y SEO noindex del concepto.
- css/concept04.css — estilos, composición, escenas, responsive, animaciones.
- js/concept04.js — capítulos de scroll, interacciones y control de movimiento.
- assets/images/* — recursos originales del proyecto CPAUL que ya estaban en main.

## Alcances y limitaciones
- La escena principal y el despiece de telas usan CSS 3D con perspectiva, **no modelos 3D WebGL/GLB**. Las fotos no se convierten en geometría volumétrica real.
- Imágenes auxiliares y video ambiental se referencian desde la vista previa temporal del Concepto 03. Antes de la fusión hay que migrarlos a assets locales versionados.
- Un segundo video UHD se carga desde Pexels; requiere elegir y servir una versión optimizada desde el proyecto definitivo y verificar derechos de uso.
- Las imágenes de productos son ilustrativas del sitio CPAUL; las imágenes de referencia textil no deben presentarse como trabajos reales del taller.
- La vista previa en Vercel es un despliegue independiente y no se sincroniza automáticamente con GitHub.
- La prueba de estado de despliegue no sustituye pruebas visuales de dispositivos reales o comparación frame a frame con el video de referencia.

## Revisión antes del merge
1. Validación visual escritorio 1440/1920, tablet 768, móvil 390/320.
2. Comprobar animación de capítulos y pinch scroll, sticky, capas 3D y botones; verificar comportamiento sin GPU.
3. Contrastar escenas con el video 50536.mp4, ajustar timing, perspectiva, retícula, tipografía.
4. Optimizar carga: poster AVIF/WebP, video MP4/WebM responsivo, caché y lazy loading.
5. Revisar contraste, teclado, semántica y prefers-reduced-motion.
6. Sustituir dependencias de la vista previa Concepto 03 por archivos propios.
7. Al aprobar: revisar metadata SEO y recién entonces evaluar fusión en main.

## Aprobación
Esperar feedback de diseño del cliente. **No cambiar main ni cpaul.store**.
