# MovilPhone · Cotizador V3 para Vercel

Aplicación independiente, en español, con catálogo real de 755 registros. Sin dependencias npm externas. Node 22 o posterior. Diseño responsive, búsqueda por equipo y ficha de servicios, cotizaciones múltiples y WhatsApp, edición de catálogo, registro de cobros y auditoría. No se conecta al sistema actual de órdenes ni procesa pagos.

## Publicar en Vercel

1. Descomprime el ZIP. Sube el contenido de esta carpeta a un repositorio GitHub PRIVADO. El archivo package.json debe estar en la raíz del repositorio.
2. En Vercel, importa ese repositorio como proyecto. Framework: Other. Build Command: `npm run build`. Output Directory: `dist`. La configuración también está en vercel.json.
3. Antes de publicar para el equipo, configura Supabase según las instrucciones siguientes. Agrega en Vercel las variables SUPABASE_URL y SUPABASE_ANON_KEY para el entorno Production (también Preview si lo utilizarás).
4. Despliega. Abre la URL y accede con una cuenta previamente creada.

Sin variables configuradas funciona únicamente la consulta del catálogo histórico: cualquier visitante de la URL podrá consultar esas referencias públicas, sin costos o márgenes. No hay guardado. Con ambas variables configuradas, el build NO incluye el catálogo en los archivos públicos; se consulta desde la base de datos con autenticación.

No se ha desplegado este proyecto en una cuenta de Vercel ni conectado a una cuenta de Supabase durante su preparación.

## Configurar Supabase una sola vez

1. Crea un proyecto Supabase propio. En SQL Editor ejecuta `supabase/01-schema.sql` UNA VEZ, en una base nueva sin tablas de esta aplicación. No lo ejecutes sobre un esquema de otro sistema. Si falla, la transacción evita una creación parcial.
2. Ejecuta `supabase/02-catalogo.sql`. Importa los 755 registros preservando su información y fecha. Puede repetirse: no sobrescribe registros que ya existen.
3. En Authentication > Users crea manualmente tu usuario con correo y contraseña y confirma el correo desde el panel. Desactiva el registro público si no lo necesitas. La aplicación no ofrece registro libre.
4. Copia el UUID del usuario. En SQL Editor ejecuta, sustituyendo UUID_REAL por el valor auténtico:

```sql
insert into public.profiles(id,name,role)
values ('UUID_REAL','Alejandro Rivero','admin');
```

5. Repite para cada colaborador usando role `colaborador`. Las cuentas se administran desde Supabase en esta versión, NO desde un panel de altas de usuarios dentro de la web.
6. En la configuración API copia la URL del proyecto y la clave pública anon o publishable. Agrégalas a Vercel como SUPABASE_URL y SUPABASE_ANON_KEY. NO uses service_role ni una clave secret. Nunca compartas contraseñas en este repositorio.
7. Despliega de nuevo para incorporar la configuración pública. La seguridad de los datos se impone mediante permisos y RLS de PostgreSQL, no mediante ocultar botones.

Para revocar acceso elimina únicamente el perfil correspondiente desde Supabase; no borres cobros ni auditorías. Si hay historial asociado, usa revocación del usuario en Auth y ajusta políticas para una baja lógica antes de eliminar perfiles. Los perfiles con cobros tienen claves foráneas protectoras.

## Uso diario

- Escribe “iPhone 11”, “iphone11”, “11” o marca/modelo. Abre el equipo para ver TODOS sus servicios y variantes registrados. No se inventan precios de servicios ausentes.
- Los nombres de pieza OLED/INCELL/ORIGINAL se agrupan en la ficha conservando calidad y variante; 4G/5G, Pro/Max/Plus se mantienen diferentes. Los modelos compuestos con barras se conservan tal como están para no inferir compatibilidades.
- Verde: autorizado con validación dentro de 90 días. Amarillo: confirmar. Rojo: diagnóstico. Todo el catálogo importado permanece pendiente: no se cambian sus fechas antiguas por la fecha del build.
- Selecciona servicios autorizados del mismo equipo. Copia o abre WhatsApp. WhatsApp requiere que el operador elija contacto y envíe; no hay envío automático.
- Consulta al técnico genera texto para copiar: no notifica automáticamente a ninguna persona.
- “Registrar cobro” guarda precio cotizado y cobrado, sucursal, usuario, fecha, nota y fotografía textual del servicio. No cobra dinero ni actualiza el precio oficial automáticamente.
- Administración permite agregar, editar, autorizar, desactivar y reactivar servicios. Para agregar batería a un iPhone ya registrado, abre su ficha y pulsa “Agregar servicio a este equipo”. No necesita volver a desplegar.
- Historial muestra hasta 200 cobros recientes, 30 cotizaciones y 30 cambios. Los promedios son de esa muestra, NO estadísticas de todo el negocio. Administrador ve todos; colaborador ve sus propios cobros y cotizaciones.
- Antes de actualizar un precio oficial, revisa sus cobros y usa “Revisar precio oficial”. Registra la fecha de validación real.
- “Actualizar catálogo” recupera cambios de otros dispositivos. No es sincronización en tiempo real. También se actualiza antes de copiar/compartir una cotización.
- Las sesiones se conservan solo en memoria por seguridad. Al recargar o expirar debes volver a entrar. No hay recuperación de contraseña ni renovación automática implementadas; restablece acceso desde Supabase.

## Arquitectura

- src/: HTML, CSS y módulos JavaScript sin framework. No requiere instalar librerías para funcionar.
- data/catalogo-original.json: fuente pública segura original. No incluye costos internos, márgenes ni mínimos.
- services: registro JSON validado y versionado. Se usa esta estructura flexible para preservar todos los campos originales, en lugar de una migración destructiva a múltiples tablas.
- profiles: roles por usuario Auth. Sin permisos de autoasignación de administrador.
- charges: cobros históricos inmutables desde la aplicación.
- quotes: mensajes generados por usuario.
- audit: antes/después con actor y fecha, creado automáticamente por trigger.
- Control de concurrencia de edición mediante version. No se borra historial al desactivar un servicio.

## Ejecutar y verificar localmente

```sh
npm run build
npm test
npm run dev
```

Abre http://localhost:3000. El build genera dist y el SQL de importación. No requiere `npm install` porque no hay dependencias. Si deseas variables locales, expórtalas en tu terminal: `.env.example` es una plantilla y no se carga automáticamente.

## Validación realizada y pendiente

Pasaron 11 pruebas automatizadas: búsqueda iPhone 11/11/iphone11/mayúsculas/error menor, Samsung A15, agrupación de todos los servicios, separación de variantes Pro, bloqueo de históricos y generación de cotización autorizada. Build estático y sintaxis JS verificados.

PENDIENTE con infraestructura real: ejecutar SQL en Supabase, login y permisos efectivos, guardar y recargar un servicio desde otro dispositivo, concurrencia, auditoría y cobros; prueba visual en Safari iPhone y escritorio; despliegue Vercel. No se afirma que esas pruebas hayan pasado.

No hay integración Meta, administración de usuarios en la web, instalación PWA/offline, procesamiento de pagos o alta de órdenes. Son límites explícitos de esta entrega. El diseño móvil sí está implementado.

Referencias oficiales de configuración y seguridad:
- https://vercel.com/docs/deployments/configure-a-build
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/postgres/row-level-security
