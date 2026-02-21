# DOCUMENTO DE ESPECIFICACIÓN DE REQUERIMIENTOS
## Sistema: Aplicación Web de Control Horario

---

## 1. Descripción Funcional del Sistema

La Aplicación de Control Horario es un sistema web moderno orientado a la gestión y control de jornadas laborales. Permitirá a los usuarios registrar entradas y salidas, gestionar pausas durante la jornada y visualizar reportes detallados del tiempo trabajado.

El sistema automatizará el cálculo de horas trabajadas, tiempos de descanso y totales acumulados por día, semana o mes. Asimismo, ofrecerá una interfaz moderna, intuitiva y responsive, accesible desde dispositivos de escritorio, tabletas y móviles.

El sistema contará con autenticación de usuarios y control de acceso por roles (Empleado y Administrador). Posteriormente se integrará con Supabase como base de datos y sistema de autenticación.

---

## 2. Funcionalidades Mínimas

### 2.1 Gestión de Usuarios
- Registro de usuario.
- Inicio y cierre de sesión.
- Recuperación de contraseña por correo electrónico.
- Edición de perfil básico (nombre, correo, contraseña).
- Asignación de rol (Empleado / Administrador), realizada únicamente por un Administrador existente.

### 2.2 Registro de Jornada Laboral
- Registrar hora de entrada.
- Registrar hora de salida.
- Registrar inicio y fin de pausas.
- Validación para evitar registros duplicados o inconsistentes.
- Edición de registros (solo administrador o dentro de un rango permitido).

### 2.3 Cálculo Automático
- Cálculo automático de:
  - Horas trabajadas por día.
  - Total de pausas.
  - Horas netas trabajadas.
- Cálculo acumulado semanal y mensual.

### 2.4 Reportes
- Visualización de reporte diario.
- Reporte semanal.
- Reporte mensual.
- Resumen gráfico del tiempo trabajado (gráfico de barras por día).
- Exportación básica (CSV o PDF en futuras versiones).

### 2.5 Interfaz y Experiencia de Usuario
- Diseño moderno y minimalista.
- Interfaz responsive.
- Dashboard principal con resumen de horas.
- Indicadores visuales de estado:
  - En jornada
  - En pausa
  - Fuera de jornada

---

## 3. Requerimientos No Funcionales

### 3.1 Rendimiento
- El tiempo de respuesta de la API no debe superar los **2 segundos** en el 95% de las peticiones bajo carga normal.
- El dashboard debe cargar en menos de **3 segundos** en conexiones estándar (10 Mbps o superior).
- El sistema debe soportar al menos **100 usuarios concurrentes** en su versión inicial sin degradación notable del rendimiento.

### 3.2 Seguridad
- Las contraseñas deben almacenarse con hashing seguro (bcrypt con un mínimo de 10 rondas de sal).
- Los tokens JWT deben tener una caducidad máxima de **8 horas**. Al expirar, se debe redirigir al usuario al login.
- Se debe implementar protección contra ataques de fuerza bruta: bloqueo temporal de cuenta tras **5 intentos fallidos** en 10 minutos.
- Toda comunicación entre cliente y servidor debe realizarse sobre **HTTPS**.
- Los endpoints de administración deben estar protegidos por validación de rol en el backend, no solo en el frontend.
- Los datos sensibles (tokens, contraseñas) no deben almacenarse en `localStorage`; usar `httpOnly cookies` o manejo en memoria.

### 3.3 Disponibilidad
- El sistema debe tener una disponibilidad objetivo del **99%** en horario laboral (lunes a viernes, 7:00–20:00).
- Debe existir un mecanismo de manejo de errores que evite pantallas en blanco ante caídas del servidor.

### 3.4 Escalabilidad
- La arquitectura debe permitir escalar horizontalmente el backend sin cambios estructurales.
- El modelo de datos debe ser diseñado pensando en la futura migración a Supabase sin refactorización mayor.

### 3.5 Mantenibilidad
- El código debe seguir convenciones de estilo definidas por el equipo (ESLint / Prettier para JS/TS).
- Las funciones y módulos críticos deben tener cobertura de pruebas unitarias mínima del **70%**.
- El proyecto debe contar con documentación de la API (Swagger / OpenAPI).

### 3.6 Accesibilidad
- La interfaz debe cumplir con las pautas **WCAG 2.1 nivel AA** en sus componentes principales.
- Todos los formularios deben ser navegables por teclado.

---

## 4. Arquitectura Frontend / Backend

### 4.1 Arquitectura General

El sistema seguirá una arquitectura cliente-servidor:

- **Frontend:** Aplicación web SPA (Single Page Application).
- **Backend:** API REST para gestión de lógica de negocio y acceso a datos.
- **Base de datos:** Relacional.
- **Autenticación:** Basada en tokens (JWT).

---

### 4.2 Frontend

**Responsabilidades:**
- Renderizado de la interfaz.
- Gestión de estado del usuario.
- Consumo de la API REST.
- Validaciones básicas del lado cliente.

**Tecnologías sugeridas:**
- React / Vue / Next.js.
- HTML5 y CSS3.
- Framework UI (Tailwind, Material UI u otro).
- Axios o Fetch para consumo de API.

---

### 4.3 Backend

**Responsabilidades:**
- Lógica de negocio.
- Validación de datos.
- Gestión de autenticación.
- Cálculo de horas trabajadas.
- Generación de reportes.
- Exposición de endpoints REST.

**Tecnologías sugeridas:**
- Node.js con Express.
- Alternativa: Python con FastAPI.

**Estructura en capas:**
- Controllers (Controladores).
- Services (Lógica de negocio).
- Repositories (Acceso a datos).
- Middleware (Autenticación y validación).

---

## 5. Modelo de Datos Propuesto

### 5.1 Tabla: users

| Campo       | Tipo            | Descripción                         |
|------------|----------------|-------------------------------------|
| id         | UUID / INT     | Identificador único                 |
| name       | VARCHAR        | Nombre completo                     |
| email      | VARCHAR        | Correo electrónico (único)          |
| password   | VARCHAR        | Contraseña encriptada               |
| role       | ENUM           | employee / admin                    |
| created_at | TIMESTAMP      | Fecha de creación                   |

---

### 5.2 Tabla: work_sessions

| Campo          | Tipo         | Descripción                          |
|---------------|-------------|--------------------------------------|
| id            | UUID / INT  | Identificador único                  |
| user_id       | FK          | Referencia a users.id                |
| date          | DATE        | Fecha de la jornada                  |
| check_in      | TIMESTAMP   | Hora de entrada                      |
| check_out     | TIMESTAMP   | Hora de salida                       |
| total_minutes | INTEGER     | Total minutos trabajados (calculado) |
| created_at    | TIMESTAMP   | Fecha de registro                    |

---

### 5.3 Tabla: breaks

| Campo            | Tipo        | Descripción                          |
|------------------|------------|--------------------------------------|
| id               | UUID / INT | Identificador único                  |
| session_id       | FK         | Referencia a work_sessions.id        |
| break_start      | TIMESTAMP  | Inicio de pausa                      |
| break_end        | TIMESTAMP  | Fin de pausa                         |
| duration_minutes | INTEGER    | Duración en minutos                  |

---

### 5.4 Relaciones

- Un usuario puede tener muchas jornadas (1:N).
- Una jornada puede tener muchas pausas (1:N).
- El total trabajado se calcula como:

```
(check_out - check_in) - suma de pausas
```

---

## 6. Manejo de Errores y Casos Borde

### 6.1 Casos Borde en el Registro de Jornada

| Caso                                                                 | Comportamiento Esperado                                                                                  |
|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| El usuario intenta registrar entrada cuando ya tiene una jornada activa | El sistema bloquea la acción y muestra un mensaje: "Ya tienes una jornada activa. Registra tu salida primero." |
| El usuario olvida registrar la salida del día anterior              | Al intentar iniciar una nueva jornada, el sistema detecta la sesión abierta y solicita cerrarla o permite que un administrador la gestione. La jornada incompleta se marca con estado `incompleta`. |
| El usuario registra salida sin haber registrado entrada             | El sistema bloquea la acción y muestra error: "No existe una jornada activa para cerrar."               |
| El usuario intenta iniciar una pausa estando ya en pausa            | El sistema bloquea la acción y muestra: "Ya tienes una pausa activa."                                   |
| El usuario intenta registrar fin de pausa sin haberla iniciado      | El sistema bloquea la acción con mensaje de error correspondiente.                                       |
| Jornada que supera las 24 horas (posible error de registro)         | El sistema emite una alerta al administrador y marca la jornada como sospechosa para revisión.           |
| Jornada con duración de 0 minutos (entrada y salida simultáneas)    | Se permite el registro pero se muestra advertencia visual. El administrador puede editarla.              |
| Registro de jornadas en días futuros                                | El sistema no permite check-in o check-out con fecha futura.                                             |
| Registro de jornadas en días muy anteriores                         | Solo un administrador puede crear o editar registros con más de 7 días de antigüedad.                    |

### 6.2 Errores del Sistema y Red

| Situación                                    | Comportamiento Esperado                                                                              |
|----------------------------------------------|------------------------------------------------------------------------------------------------------|
| El servidor no responde al hacer check-in    | Se muestra un mensaje de error claro. La acción NO se reintenta automáticamente para evitar duplicados. |
| Pérdida de conexión durante una sesión activa | El estado actual se mantiene en el backend. Al reconectar, el frontend sincroniza el estado real.   |
| Token JWT expirado durante el uso            | Se muestra modal informando la expiración y se redirige al login sin perder la jornada activa.       |
| Error interno del servidor (500)             | Se muestra mensaje genérico: "Ocurrió un error inesperado. Por favor, intenta más tarde."            |

### 6.3 Validaciones de Formularios

- El correo electrónico debe tener formato válido.
- La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula y un número.
- Los campos obligatorios deben estar marcados visualmente con asterisco (*).
- Los mensajes de error deben aparecer inline junto al campo correspondiente, no solo en alertas globales.

---

## 7. Criterios de Aceptación / User Stories

### 7.1 Módulo de Autenticación

---

**US-01: Registro de usuario**

> Como nuevo usuario, quiero poder registrarme con mi nombre, correo y contraseña, para acceder al sistema.

**Criterios de aceptación:**
- El formulario solicita nombre completo, correo electrónico y contraseña.
- El correo debe ser único; si ya existe, se muestra: "Este correo ya está registrado."
- La contraseña debe cumplir los requisitos mínimos de seguridad (8 caracteres, 1 mayúscula, 1 número).
- Tras el registro exitoso, el usuario es redirigido al dashboard con rol `employee` por defecto.

---

**US-02: Inicio de sesión**

> Como usuario registrado, quiero iniciar sesión con mi correo y contraseña, para acceder a mi panel de control.

**Criterios de aceptación:**
- Si las credenciales son correctas, se genera un token JWT y se redirige al dashboard.
- Si las credenciales son incorrectas, se muestra: "Correo o contraseña incorrectos."
- Tras 5 intentos fallidos, la cuenta se bloquea temporalmente por 10 minutos.

---

**US-03: Cierre de sesión**

> Como usuario autenticado, quiero poder cerrar sesión de forma segura.

**Criterios de aceptación:**
- Al cerrar sesión, el token es invalidado en el cliente.
- El usuario es redirigido a la pantalla de login.
- No se puede acceder a rutas protegidas después del cierre de sesión.

---

### 7.2 Módulo de Jornada Laboral

---

**US-04: Registrar entrada**

> Como empleado, quiero registrar mi hora de entrada, para que el sistema comience a contabilizar mi jornada.

**Criterios de aceptación:**
- El botón "Iniciar jornada" está disponible solo si no hay una jornada activa.
- Al pulsarlo, se crea un registro en `work_sessions` con `check_in = ahora`.
- El estado del dashboard cambia a "En jornada".
- Se muestra la hora de entrada registrada.

---

**US-05: Registrar salida**

> Como empleado, quiero registrar mi hora de salida, para cerrar mi jornada laboral.

**Criterios de aceptación:**
- El botón "Finalizar jornada" está disponible solo si hay una jornada activa y no hay pausas abiertas.
- Al pulsarlo, se registra `check_out = ahora` y se calcula `total_minutes`.
- El estado del dashboard cambia a "Fuera de jornada".
- Se muestra el resumen del día (horas trabajadas, tiempo en pausas).

---

**US-06: Registrar pausa**

> Como empleado, quiero registrar el inicio y fin de mis pausas, para que se descuenten del tiempo trabajado.

**Criterios de aceptación:**
- El botón "Iniciar pausa" está disponible solo durante una jornada activa.
- Al iniciar pausa, el estado cambia a "En pausa".
- El botón "Finalizar pausa" aparece mientras hay una pausa activa.
- Al finalizar la pausa, se calcula y almacena `duration_minutes`.

---

### 7.3 Módulo de Reportes

---

**US-07: Ver reporte diario**

> Como empleado, quiero ver un resumen de mi jornada de hoy, para conocer mis horas trabajadas.

**Criterios de aceptación:**
- Se muestra: hora de entrada, hora de salida, total de pausas, horas netas trabajadas.
- Si la jornada está en curso, los valores se actualizan en tiempo real o con un botón de refresco.
- Si no hay jornada registrada para hoy, se muestra: "No hay registros para el día de hoy."

---

**US-08: Ver reporte semanal y mensual**

> Como empleado, quiero ver mis horas acumuladas por semana y mes, para hacer seguimiento de mi productividad.

**Criterios de aceptación:**
- Se muestra una tabla con el desglose diario de horas dentro del periodo seleccionado.
- Se muestra el total acumulado del periodo.
- Se puede navegar entre semanas o meses con controles de anterior / siguiente.

---

**US-09: Visualización gráfica**

> Como empleado, quiero ver un gráfico de mis horas trabajadas por día, para identificar visualmente mis patrones laborales.

**Criterios de aceptación:**
- Se muestra un gráfico de barras con el total de horas netas trabajadas por día en la semana o mes seleccionado.
- El gráfico es responsive y legible en móvil.

---

### 7.4 Módulo de Administración

---

**US-10: Editar registro de jornada (Administrador)**

> Como administrador, quiero poder editar o corregir registros de jornada de cualquier empleado, para gestionar errores o ausencias.

**Criterios de aceptación:**
- El administrador puede modificar `check_in`, `check_out` y las pausas de cualquier jornada.
- Los cambios quedan registrados con timestamp de modificación y referencia al administrador que los realizó (auditoría básica).
- El empleado ve la jornada con los datos corregidos.

---

**US-11: Asignar rol a usuario (Administrador)**

> Como administrador, quiero poder asignar o cambiar el rol de un usuario, para gestionar los permisos del sistema.

**Criterios de aceptación:**
- El administrador ve una lista de usuarios con su rol actual.
- Puede cambiar el rol entre `employee` y `admin`.
- Un administrador no puede degradar su propio rol.

---

## 8. Flujos de Usuario Principales

### 8.1 Flujo de Jornada Laboral Estándar

```
[Login] → [Dashboard] → [Iniciar Jornada] → [En jornada...]
    → (opcional) [Iniciar Pausa] → [Finalizar Pausa]
    → [Finalizar Jornada] → [Ver resumen del día]
```

### 8.2 Flujo de Jornada Incompleta

```
[Jornada activa sin check_out] → [Nuevo día / nuevo login]
    → [Sistema detecta sesión abierta]
    → [Notificación al usuario y al administrador]
    → [Admin cierra o corrige el registro]
```

---

## 9. Glosario

| Término           | Definición                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Jornada laboral   | Período de trabajo entre el check-in y el check-out de un empleado.        |
| Pausa             | Interrupción temporal dentro de la jornada (descanso, almuerzo, etc.).     |
| Horas netas       | Total trabajado descontando el tiempo de pausas.                           |
| Check-in          | Registro de hora de entrada al trabajo.                                    |
| Check-out         | Registro de hora de salida del trabajo.                                    |
| Jornada incompleta | Jornada que tiene check-in pero no check-out al finalizar el día.         |
| Rol               | Nivel de acceso del usuario: `employee` (empleado) o `admin` (administrador). |
