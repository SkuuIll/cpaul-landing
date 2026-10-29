# CPAUL — Concepto 04 / Cinematic Textile Experience

> **Estado:** prototipo experimental para revisión visual. No publicar en \`cpaul.store\` ni fusionar con \`main\` sin aprobación.

## Objetivo
Reinterpretar el lenguaje visual del video de referencia \`50536.mp4\` (prenda protagonista, interfaz editorial industrial, movimiento de cámara, vista explotada de materiales) para una landing institucional de CPAUL. El video sirve como referencia de dirección artística, no como fuente de contenido ni copia literal de su diseño.

## Estructura
- \`index.html\` — narrativa HTML accesible y metadatos noindex de preview.
- \`css/concept04.css\` — diseño responsive cinematográfico y fallback de capas.
- \`js/concept04.js\` — narrativa controlada por scroll, menú móvil, carga diferida de video y visualización WebGL.
- \`assets/images/*\` — activos originales del repositorio existentes en \`main\`. Se preserva \`assets/images/logo.webp\`.

## Escenas
1. **Objeto / 001:** buzo CPAUL protagonista, paneles técnicos, HUD y tres capítulos según el scroll.
2. **Manifiesto:** tipografía editorial y transición a la materia.
3. **Arquitectura textil:** cinco superficies 3D independientes renderizadas con Three.js, con tejido procedural y separación sincronizada con el desplazamiento. Modo CSS cuando WebGL o CDN no están disponibles.
4. **Proceso:** metraje de bordado de referencia (Pexels) bajo carga diferida, y pasos de diseño y personalización.
5. **Especialidades:** bordados, sublimación e indumentaria institucional; no tienda ni listado de productos.
6. **Contacto:** WhatsApp e Instagram.

## Compatibilidad y rendimiento
- El scroll y la navegación básicos usan JavaScript nativo.
- Three.js se importa condicionalmente desde CDN en dispositivos con WebGL. Si falla, se conserva una composición de capas en CSS.
- El canvas limita DPR a 1 en móviles chicos y a 1.5 en escritorio; se desactiva por visibilidad.
- Las imágenes locales cargan en WebP; el video de proceso tiene \`preload="none"\` y se inicia solo cuando es visible en pantalla amplia.
- Se respeta \`prefers-reduced-motion\`. La experiencia conserva su contenido sin WebGL.
- Responsive para escritorio, tablet y móviles, con menú accesible.
- La vista previa incluye \`noindex,nofollow\`.

## Limitaciones conocidas del prototipo
- La prenda protagonista es una **imagen con transformaciones de perspectiva**, no una malla 3D de la prenda. La escena de materiales sí usa geometría 3D renderizada con WebGL.
- Las texturas WebGL son procedurales y conceptuales, no fichas técnicas certificadas de materiales de CPAUL.
- Three.js y el metraje Pexels dependen de servicios externos; el diseño sigue siendo legible cuando esos recursos no responden.
- El objetivo es validar la dirección artística; faltan pruebas visuales y métricas de rendimiento de laboratorio en dispositivos físicos antes de una publicación definitiva.

## Procedimiento de revisión
1. Abrir una **URL de vista previa aislada**, nunca \`cpaul.store\`.
2. Revisar capítulos y profundidad de capas en escritorio y Android.
3. Evaluar carga del video, movimiento reducido, navegación, WhatsApp y distintos anchos.
4. Ajustar tras recibir feedback.
5. Solo fusionar con \`main\` mediante PR aprobado por el usuario.

**No hay configuración de GitHub Actions necesaria.**
