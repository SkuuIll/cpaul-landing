# CPAUL — Sitio editorial y catálogo de autor

Presentación estática de alto nivel compatible con Cloudflare Pages, Netlify, Vercel o cualquier servidor estático. No necesita compilación, servicios externos de tipografía, paquetes ni servidor de aplicación.

## Estructura del proyecto
- `index.html`: Portada editorial, catálogo interactivo con filtros, formulario a WhatsApp, sección de compartir y metadatos SEO/Open Graph.
- `404.html`: Página de error 404 personalizada con diseño editorial de lujo, 404 tridimensional dorado de fondo, enlaces funcionales a la colección y WhatsApp.
- `css/styles.css`: Estilos de identidad de marca (negro profundo, marfil y dorado metálico), cinta infinita ultra-suave, "CPAUL" 3D con relieve y brillo dorado, diseño responsive y estados accesibles.
- `js/main.js`: Navegación responsive, filtros de prendas, cálculo y envío de consultas a WhatsApp, Web Share API (para móviles), copiado de enlace con toast flotante y control de movimiento/parallax.
- `assets/images/`: Campaña visual con buzos, remeras, gorras, detalle de bordado artesanal y logo oficial.
- `site.webmanifest`: Manifiesto para Progressive Web App (PWA) e iconos móviles.
- `robots.txt`: Reglas de rastreo e indexación para Google y otros motores de búsqueda.
- `sitemap.xml`: Mapa de sitio XML canónico para indexación y SEO.
- `_headers`: Encabezados de seguridad (CSP, Referrer-Policy, Permissions-Policy) y caché optimizada para Cloudflare Pages.

## Características visuales e interactivas destacadas
1. **Cinta infinita (Ticker)**: Animación continua suave (`marquee-smooth`), duplicada con exactitud matemática para nunca cortarse ni saltar en monitores 4K ni en teléfonos. Pausa automática al pasar el cursor (`:hover`).
2. **"CPAUL" 3D Dorado en el Hero**: Tipografía monumental con gradiente dorado metálico multicapa (`#edd6a3` a `#8f6e2b`), relieve y biselado tridimensional con sombras de profundidad físicas (`drop-shadow` multicapa), destello sutil (`gold-shimmer`) y micro-movimiento.
3. **Compartir en redes y mensajería**:
   - **Open Graph y Twitter Cards enriquecidas**: Al compartir el link en WhatsApp, Instagram DMs, Telegram, Facebook o Twitter, genera una tarjeta de previsualización con la imagen de campaña en alta resolución.
   - **Botón "Compartir" en cabecera**: Acceso rápido para compartir la tienda.
   - **Sección de compartir dedicada**: Permite compartir mediante la Web Share API en teléfonos móviles (abriendo WhatsApp, Instagram Stories, etc.), compartir directamente por WhatsApp o copiar el enlace al portapapeles con confirmación visual (Toast flotante).
4. **Página de error 404 de alta gama**: Integrada con la misma identidad estética para que nunca se pierda un cliente, con accesos directos al catálogo y al taller.
5. **Accesibilidad**: Respeto total de `prefers-reduced-motion` y botón de control de animación en portada.

## Publicación en Cloudflare Pages
1. En el panel de Cloudflare, entrá a **Workers & Pages** y creá una aplicación Pages mediante **Direct Upload** (o conectá tu repositorio Git).
2. Subí el contenido de esta carpeta (asegurándote de que `index.html`, `404.html`, `_headers`, `robots.txt`, `sitemap.xml` y las carpetas `assets`, `css`, `js` queden en la raíz).
3. Publicá y asigná tu dominio propio. No requiere pasos de build ni dependencias `npm`.
