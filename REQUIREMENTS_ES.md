INFTOUR — Documento de requisitos para el cliente

Este documento describe el producto mínimo actualmente entregado y los requisitos para completar o ampliar el proyecto para el cliente.

—————————————————————————————————————————————————————————

1. ALCANCE ACTUAL (LÍNEA BASE MÍNIMA)

1.1 Global

• Idiomas: Inglés, español y ruso (almacenados en app/lib/langStore.ts, persistidos en localStorage).

• Maquetación: Barra superior fija (tiempo, temperatura del mar, enlace webcam) → Navegación fija → Contenido de la página → Pie de página.

• Navegación: Cinco apartados (Reserva directa, Experiencias, Servicios, Revista, Lobby) + botón de chat IA + selector de idioma. Barra inferior dorada al pasar el ratón y en la página activa.

• Pie de página: Eslogan, línea de licencia, enlaces de navegación, contacto (teléfono, email, dirección con enlace a Google Maps).


1.2 Páginas

• Reserva directa (ruta /): Iframe de reservas embebido (p. ej. bookonline.pro). Estado de carga placeholder.

• Experiencias (ruta /experiencias): Hero “Ecosistema de descanso” + 6 tarjetas de sección: Guía IA, Gastronomía, Naturaleza, Familia, Relax, Deporte; cada una con subsecciones y traducciones.

• Servicios (ruta /services): Hero + 3 bloques alternos imagen/texto (alquileres, concierge, soporte) + Información práctica (policía, médico, traslados, alquiler de coche, supermercado a domicilio, alquiler de bicis) + Actividades (senderismo, barca, buceo, ciclismo, vino, playas).

• Revista (ruta /revista): Si MAGAZINE_PDF_PATH está definido en app/config/magazine.ts: visor de PDF + enlace de descarga. En caso contrario: portada placeholder + 3 páginas (temas de alquiler).

• Lobby (ruta /lobby): Sobre nosotros + equipo (4 personas placeholder) + imágenes de oficina + mapa de Google embebido + texto del chat IA + formulario de contacto (tarjeta oscura) + enlaces Políticas y legal + FAQ (centrado, acordeón).


1.3 Contacto y back-end

• Formulario de contacto (Lobby): POST /api/contact con email y mensaje. Validación y respuesta 200; los envíos solo se registran en log. Aún no se envía email real (TODO en código).

• Webcam: Enlace en la barra superior a URL externa; existe ruta API opcional de proxy pero no se usa.


1.4 Contenido y recursos

• Textos: Toda la interfaz y textos de página en langStore.ts (eng/esp/ru). Nombres del equipo, políticas, FAQ, servicios, experiencias, etc. se editan ahí.

• Imágenes: Servicios, Experiencias y Revista usan URLs de Unsplash; equipo y oficina del Lobby usan placeholders. La ruta del PDF de la revista se configura en app/config/magazine.ts y public/magazine/.

—————————————————————————————————————————————————————————

2. REQUISITOS PARA EL CLIENTE (POR HACER / OPCIONAL)

2.1 Imprescindibles (para salir a producción)

□ Formulario de contacto con envío real de email: Conectar /api/contact a un proveedor de email (p. ej. Resend, Nodemailer) para que los mensajes lleguen a booking@inftour.com (o el correo que indique el cliente). Sustituir o eliminar el registro en consola.

□ Contenido real: Sustituir nombres del equipo, fotos e imágenes de oficina por datos reales. Actualizar langStore y, si aplica, imágenes en public/team/ o URLs en componentes.

□ Enlaces de políticas y legal: Los enlaces del Lobby (cancelación, pago, términos, privacidad) apuntan actualmente a #. Crear páginas o PDFs reales y asignar los href correctos (o URLs externas).

□ Revista (si se usa): Si el cliente publica una revista en PDF: añadir el archivo en public/magazine/ y definir MAGAZINE_PDF_PATH en app/config/magazine.ts. Si no, dejar el placeholder o eliminar la sección.

□ Motor de reservas: Confirmar con el cliente la URL y parámetros del iframe embebido (p. ej. bookonline.pro). Verificar propiedad, idioma y requisitos legales o de cookies.

□ Licencia y textos legales: Sustituir la licencia placeholder del pie (p. ej. EGVT-XXX-A) por la licencia real de tour operador y los avisos legales que correspondan.


2.2 Recomendables (experiencia de usuario y confianza)

□ Comportamiento del chat IA: El chat actual es solo interfaz (respuestas placeholder). Decidir: mantenerlo como CTA de contacto o integrar un chatbot/API real y actualizar textos en Lobby y navegación.

□ Webcam de Calpe: El enlace de la barra superior lleva a la webcam externa. Si el cliente quiere reproductor en página (p. ej. HLS), se puede conectar el componente CalpeWebcam y/o la ruta API de webcam; si no, mantener el enlace externo.

□ SEO y meta: Añadir o ajustar metadata (título, descripción, etiquetas OG) por ruta en app/layout.tsx o por página. Valorar sitemap y robots si aplica.

□ Analíticas y consentimiento: Si el cliente quiere analíticas (p. ej. Google Analytics), añadir el script y, si es obligatorio en la UE, banner de cookies/consentimiento y documentarlo en requisitos.


2.3 Opcionales (futuro)

□ Tiempo y mar en tiempo real: Tiempo y temperatura del mar se obtienen ya en el servidor; confirmar fuente de datos y alternativas con el cliente.

□ CMS para Experiencias / Servicios: Si el contenido cambiará a menudo, valorar sacar los textos (o parte) a un CMS o JSON/MD y cargarlos de forma dinámica en lugar de solo en langStore.

□ Accesibilidad y rendimiento: Ejecutar Lighthouse (accesibilidad, rendimiento), corregir incidencias críticas y añadir ARIA o soporte por teclado que falte.

□ Estados de error y carga: Añadir límites de error genéricos y, donde aplique, pantallas de carga (p. ej. iframe de reservas, PDF o futuras llamadas API).

—————————————————————————————————————————————————————————

3. NOTAS TÉCNICAS PARA DESARROLLADORES

• Stack: Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand (store de idioma).

• Configuración: Ruta de la revista → app/config/magazine.ts. Destinatario del contacto → app/api/contact/route.ts (TO_EMAIL).

• Traducciones: Fuente única en app/lib/langStore.ts; las claves se usan en Nav, Footer y todo el contenido de las páginas.

• Despliegue: Compilar y ejecutar como aplicación Next.js estándar (p. ej. Vercel). Definir variables de entorno si se añade proveedor de email o API externa.

—————————————————————————————————————————————————————————

4. RESUMEN

El código actual es una estructura mínima pero completa: multidioma, todas las páginas principales (reservas, experiencias, servicios, revista, lobby), API del formulario de contacto y revista y email de contacto configurables.

Para entregar al cliente en producción: implementar el envío real de email del contacto, sustituir placeholders (equipo, oficina, políticas, licencia) y confirmar el comportamiento de reservas y revista. Opcional: integración del chat IA, webcam en página, SEO, analíticas y contenido gestionado por CMS.
