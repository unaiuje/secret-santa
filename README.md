# Regalizo — prototipo navegable (MVP)

Prototipo de alta fidelidad del concepto descrito en el documento de producto: un organizador de amigo invisible que resuelve el ciclo completo (normas → perfiles → sorteo → regalo → revelación), no solo el sorteo.

## Cómo abrirlo

- **Doble clic en `index.html`** — funciona sin servidor ni instalación (todo el estado es local).
- Para probarlo como **PWA instalable** (con manifest + service worker), sírvelo por HTTP:

```bash
cd regalizo
npx serve .          # o: python -m http.server 8000
```

y abre `http://localhost:3000` (o `:8000`). En móvil,instalable desde el menú del navegador → "Añadir a pantalla de inicio".

## Qué incluye el prototipo

| Flujo | Pantallas |
|---|---|
| **Cuentas** | Login "Continuar con Google" (simulado a nivel de UI: selector de cuentas + crear cuenta). Cada cuenta tiene sus propios eventos y su perfil, persistidos en `localStorage` — la sesión sobrevive al recargar |
| **Eventos persistentes** | "Mis eventos": tarjetas con estado (Borrador / En marcha / Cerrada), progreso de perfiles y regalos. Un evento cerrado se **repite en un clic para el año siguiente** ("Familia José 2027"): clona participantes y normas, sube las fechas un año y aplica «no repetir asignación» con el historial del año anterior |
| **Anfitrión (wizard de 4 pasos)** | evento (presupuesto fijo/rango + fechas) → normas (tono, no-repetir, exclusiones, tema) → invitar (código + enlace + añadir/eliminar participantes + simulación de actividad) → lanzar sorteo |
| **Gestión de participantes** | añadir a mano, eliminar con confirmación; si el sorteo ya está lanzado, eliminar a alguien **relanza el sorteo** automáticamente para el resto |
| **Panel del anfitrión** | progreso (perfiles / regalos con etiqueta textual), "necesita tu atención", recordatorios, normas (incluye historial de asignaciones previas), participantes |
| **Participante invitado** | unirse con código, perfil de 90 s (3 gustos, 1 no-quiere, hobbies, nivel divertido↔formal) que **viaja entre eventos**, pantalla "esperando el sorteo" |
| **Tras el sorteo** | tarjeta **"Tu persona"** (gustos, no-quiere, ideas dentro de presupuesto con enlaces, chat, "ya lo compré"), chat anónimo con preguntas guiadas (máx. 3/día), revelación con minijuego de adivinanza + reseña |
| **Responsive** | móvil primero; desde 640px la lista de eventos pasa a rejilla y desde 840px el panel y "Tu persona" se organizan en dos columnas |

## Qué está simulado (todo local, sin backend)

- **Union de participantes y actividad del grupo** — botón "⚡ Simular actividad": guion de 16 eventos (se unen, completan perfil, compran).
- **Sorteo** — derangement con exclusiones y, si "persona afín" está activa, best-of-N por solapamiento de hobbies (sugerencia, no garantía). Fallback si las exclusiones son imposibles.
- **Chat** — respuestas precocinadas con retardo de 900 ms.
- **Persistencia** — `localStorage`. Botón ⟳ arriba a la derecha para reiniciar la demo.

## Decisiones visuales

- Mobile-first (marco de teléfono en desktop), tipografía redondeada, coral `#E4573D` como acento.
- Medidores del panel validados con el script de la skill dataviz: coral `#E4573D` + azul `#2B6CB0` (ΔE protan 18.8, todos los checks en PASS). El verde `#1F8A5B` queda reservado a estados ("comprado ✓") siempre con icono + texto — nunca color solo.
- Chat sin texto libre: solo preguntas guiadas → cero moderación.

## Notas para el salto a MVP real

- El tag de afiliado `regalizo-21` en los enlaces de Amazon es un placeholder: sustituir por el tag real de Amazon Partnernet (y añadir el disclosure legal).
- El motor de sorteo debe moverse a servidor (server action / edge function) con RLS en la tabla de asignaciones.
- Auth real: magic link por teléfono/email (Supabase Auth). Aquí no hay cuentas.
- Recordatorios: aquí son una vista estática; en producción, cola programada (cron) con email (Resend) + web push.

## Próximos pasos sugeridos

1. Test del prototipo con 5 usuarios reales (el wizard debe bajar de 3 min).
2. Backend real (Supabase): eventos, participantes, asignaciones con RLS.
3. Notificaciones por email + web push; bot de Telegram.
4. Recomendador v2 con LLM sobre el catálogo curado.

## Inspiración tomada de la beta propia (GiftFlow / secretsanta-4)

Explorada con Playwright (registro + wizard completo + página de evento). Cosas copiadas a este prototipo:

- **Countdown "X días restantes"** — pill en el panel y en las tarjetas de eventos (hacia el sorteo antes de sortear; hacia el intercambio después).
- **Código de invitación por evento, prominente** — cada evento genera un código de 6 caracteres (sin caracteres ambiguos), visible en el wizard, en el panel con copia en un clic y en el enlace; el clon del año siguiente genera código nuevo.
- **Tarjeta de acción "Mi perfil de gustos"** en el panel cuando aún está vacío.
- **Tono del evento como 3 tarjetas** (Divertido / Equilibrado / Formal, con descripción) en vez de un slider — mismo patrón que su "Estilo de regalo".

Ideas suyas anotadas como roadmap (no se construyen todavía):

- **Tipos de evento**: Amigo Invisible / Cumpleaños (bote común + seguimiento de pagos) / Boda (lista de deseos con financiación) / Personalizado. Expansión estratégica natural de "organizador de regalos en grupo", fuera del MVP actual.
- Barra de navegación inferior flotante en móvil (Eventos | Chat).
- Auth por email+contraseña (aquí se mantiene Google simulado).

Screenshots de la exploración en `.explore/` — carpeta local, no se publica en el repositorio (ver `.gitignore`).
