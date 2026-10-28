# ADR-0004: Firebase (Firestore + Auth email/password) como backend, y Capacitor para empaquetar app nativa — de forma progresiva

- **Fecha**: 2026-09-22 (corregida el mismo día: auth pasa de anónima a email/password)
- **Estado**: Aceptada — ejecución **diferida** por [ADR-0006](./ADR-0006-estudiantes-locales.md) (2026-10-20): primero multiusuario local, Firebase solo si hace falta usar varios dispositivos
- **Supera a**: [ADR-0003](./ADR-0003-diferir-backend.md)

## Contexto
El plan real es usar la app en el celular de forma recurrente (no solo un experimento de escritorio), y eventualmente tener una app instalable. Esto cambia el cálculo de ADR-0003: sincronizar progreso entre dispositivos deja de ser un "nice to have" lejano. El usuario quiere además que esto sea progresivo y sirva como ruta de aprendizaje, no un salto directo a "todo junto".

**Corrección importante**: la primera versión de este ADR proponía Auth anónima. Se descubrió que **la auth anónima de Firebase no sincroniza entre dispositivos/instalaciones** — cada navegador o instalación de la app genera su propio `uid` anónimo, sin relación entre sí (la web en el celular, la app empaquetada con Capacitor, y el laptop serían 3 identidades distintas). Como el objetivo explícito es sincronizar progreso entre el celular y la web, anónimo no cumple el requisito real.

## Decisión
1. **Persistencia**: adoptar **Firebase** — **Firestore** (NoSQL) como base de datos y **Firebase Authentication con email/password**, usando **una sola cuenta fija** (la del propio usuario, uso 100% personal — no hay registro público ni multi-usuario). Se implementa `FirebaseRepository` cumpliendo la misma interfaz `ProgressRepository` definida en ADR-0003 — **no se descarta el patrón Repository, al contrario, es lo que hace posible este cambio sin reescribir la UI**.
2. **Empaquetado nativo**: usar **Capacitor** (sin Ionic) para envolver la misma app React y generar un build instalable en Android (y eventualmente iOS), cuando la versión web ya esté estable.
3. **Orden de ejecución** (progresivo, no todo a la vez — ver detalle en [ROADMAP](../../03-proceso/ROADMAP.md)):
   - Paso A: React + `LocalStorageRepository` (aprender componentes/hooks sin ruido de red/async).
   - Paso B: `FirebaseRepository` detrás de la misma interfaz + Auth email/password + reglas de seguridad de Firestore por `uid`.
   - Paso C: Capacitor para empaquetar como app instalable en el celular, iniciando sesión con la misma cuenta.

## Alternativas consideradas
- **Backend propio (Node/Express + Postgres/Mongo)**: descartado — mucho más para mantener (hosting, migraciones de esquema, servidor corriendo) sin beneficio real para un proyecto de 1 usuario. Firebase da DB + Auth + hosting gestionado sin operar servidores.
- **Supabase (alternativa BaaS con Postgres)**: válida también, pero Firebase tiene más tutoriales/soporte para el combo específico React + Capacitor, y Firestore (NoSQL) encaja bien con el modelo de contenido ya pensado (documentos tipo `Course`/`Lesson`/`Progress`, sin joins complejos).
- **Ionic + Capacitor**: descartado el uso de Ionic — su librería de componentes es una capa de aprendizaje adicional no necesaria; Capacitor solo, sobre React puro, alcanza.
- **Auth anónima**: descartada — no sincroniza entre dispositivos/instalaciones (ver corrección arriba), que es justamente el objetivo.
- **Google Sign-In**: descartado por ahora — requiere configurar OAuth client IDs y, en Capacitor, un plugin nativo adicional. Más fricción de setup que email/password para un solo usuario. Se revisita si se comparte la app con alguien más.

## Consecuencias
- ✅ Progreso disponible desde el celular y la web, sincronizado bajo la misma cuenta (email/password), iniciando sesión una vez por dispositivo.
- ✅ El patrón Repository de ADR-0003 no se desperdicia: es literalmente lo que permite este cambio sin tocar componentes/hooks de la UI (demostración práctica de **Dependency Inversion**).
- ✅ Capacitor no obliga a reescribir UI para tener una app instalable.
- ⚠️ Se agrega complejidad real de aprendizaje: async/Promises al leer/escribir datos, un flujo de login simple (pantalla o formulario mínimo), reglas de seguridad de Firestore (**obligatorias**, no opcionales — sin ellas cualquiera con la config pública del proyecto podría leer/escribir toda la base de datos), y manejo de estados de carga/error en la UI.
- ⚠️ Hay que crear el usuario email/password una vez (vía consola de Firebase o un script/flujo de registro que se usa una sola vez y luego se retira) y recordar la contraseña — no hay recuperación automática sin configurar envío de emails.
- 🔁 Revisar si se necesita otro método de login si algún día se comparte la app con otra persona (Google Sign-In o multi-cuenta).
