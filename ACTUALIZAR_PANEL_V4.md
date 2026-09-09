# Actualizar el panel de MovilPhone

Este paquete contiene únicamente la carpeta src y estas instrucciones. Actualiza el proyecto existente; no es un proyecto nuevo completo. Compatible con la base de Supabase, variables de Vercel, scripts y package.json de V3.

## Subir en GitHub

1. Descomprime MovilPhone_Actualizar_Panel_V4.zip.
2. Abre tu repositorio `freakaxxl/cotizadormovilphone` en GitHub. Permanece en su página principal, donde se ven package.json, src, scripts y data.
3. Elige Add file > Upload files.
4. Arrastra la carpeta COMPLETA `src` que viene dentro del ZIP. Deben aparecer CINCO rutas: src/index.html, src/style.css, src/app.js, src/core.js y src/view.js. No arrastres el ZIP ni subas los archivos sueltos a la raíz.
5. Pulsa Commit changes en la rama conectada a Vercel (main).
6. Vercel iniciará un despliegue por la actualización del repositorio conectado. Espera el estado Ready y abre tu dirección habitual. Si no inicia, revisa Deployments del mismo proyecto y vuelve a desplegar el commit nuevo.
7. Recarga la página y vuelve a entrar con tu cuenta de Supabase.

No necesitas crear un proyecto, importar precios, ejecutar SQL ni cambiar las variables de entorno. Los archivos del ZIP no contienen claves ni precios. Tus datos permanecen en Supabase. Mantén el resto de archivos del repositorio.

## Qué cambia

- Precios visibles en cada resultado, junto al servicio y calidad.
- Búsqueda por equipo o por equipo más servicio.
- Poco X4 ya no coincide con M4 por compartir el número 4.
- Alias display/pantalla y nombres sin prefijos de marca duplicados.
- Detalles de garantía/tiempo bajo un desplegable.
- Copiar una cotización autorizada directamente desde el resultado.
- Confirmación para reemplazar calidades alternativas al combinar servicios.
- Cotización vacía oculta. El catálogo utiliza todo el ancho disponible.
- Encabezado compacto, diseño móvil y catálogo general para toda la marca.
- Sucursal trasladada a “Lugar de atención” al pie y disponible al registrar cobro. No filtra ni modifica precios. Se mantienen los dos establecimientos existentes.
- Administración y guardado existentes conservados. Cobros nuevos guardan además el precio oficial de referencia en su snapshot, sin cambiar las tablas.

Los precios pendientes siguen visibles como referencias internas: el administrador debe revisar el precio y la fecha antes de autorizar su envío al cliente. No se autorizaron registros de forma masiva.

## Comprobar después del despliegue

1. Busca `pantalla Poco X4`: deben aparecer servicios con importes inmediatamente, sin M4.
2. Busca `iPhone 11`: aparecen sus servicios y variantes registrados.
3. Comprueba Administrar, Historial y Registrar cobro.
4. Revisa desde el celular y computadora.
5. Para enviar un precio, usa un servicio que hayas validado realmente. Los pendientes no se envían como definitivos.

Validación local: build y sintaxis JavaScript; 21 pruebas automatizadas entre regresiones de V3, búsqueda, HTML de resultados, precios, permisos visuales y escape de contenido. No se accedió a la cuenta de producción ni se ejecutaron nuevas pruebas de guardado real en Supabase. No se realizaron pruebas visuales automatizadas en Safari.

La estructura futura de franquicias sigue siendo un plan: este cambio mejora la consulta del catálogo general y no crea nuevos roles ni separación por franquicia.

## Volver a la versión anterior

Conserva el commit anterior. Si necesitas revertir, revierte únicamente el commit de esta actualización en GitHub y deja que Vercel vuelva a desplegar. No borres registros ni tablas de Supabase.
