# Mejoras pendientes — Módulo Auth y Usuarios

> Auditoría realizada después de cerrar la Fase 0.1 (ConfigModule) y la Fase 0.2 Parte A (PrismaExceptionFilter).
>
> Este documento lista todo lo detectado, priorizado, con el "por qué" y el "cómo" para resolverlo.

---

## Checklist rápido

### 🔴 Críticos (seguridad y bugs)
- [ ] 1. Migrar `jwt.strategy.ts` a `ConfigService`
- [ ] 2. Eliminar o proteger `POST /usuarios` (cualquiera puede crear admins)
- [ ] 3. Agregar `apellido` al interface `Usuario`

### 🟡 Importantes (inconsistencias y deuda)
- [ ] 4. Unificar `@MinLength` de password (cierra fase 0.6)
- [ ] 5. Separar `passwordHash` interno vs `password` público en DTOs
- [ ] 6. Actualizar `ActualizarUsuarioDto` con el contrato correcto
- [ ] 7. Decidir política de pre-check en `findOne` y aplicar consistente
- [ ] 8. Quitar import muerto de `ConflictException` en `auth.service.ts`
- [ ] 9. `roles.guard.ts` debe usar `ROLES_KEY` en lugar de string literal

### 🟢 Polish (mejoras de calidad)
- [ ] 10. `@HttpCode(200)` en `POST /auth/login`
- [ ] 11. Corregir comentario obsoleto en `role.decorator.ts`
- [ ] 12. Refactor de `AuthService` con helpers privados (DRY)

### 🔜 Pendientes de fases futuras (recordatorios)
- [ ] 13. `GET /usuarios/me` — Fase 2 (frontend auth)
- [ ] 14. `POST /auth/change-password` — Fase 5 (perfil de usuario)
- [ ] 15. `POST /auth/refresh` — Fase 7 (hardening)
- [ ] 16. Rate limiting con `nestjs-throttler` en `/auth/*` — Fase 7

---

## 🔴 CRÍTICOS

### 1. Migrar `jwt.strategy.ts` a `ConfigService`

**Archivo:** `perfumeria-backend/src/auth/strategy/jwt.strategy.ts`

**Problema actual:**
```ts
secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRET_KEY',
```

Es exactamente el agujero que la Fase 0.1 buscó cerrar pero quedó pendiente en este archivo. Si la env var no se carga o se borra por error, la app sigue funcionando con un secreto público hardcodeado, permitiendo a cualquiera firmar tokens válidos.

**Por qué es crítico:** Esta estrategia es la que valida los tokens entrantes. Sin un secreto seguro, todo el sistema de autenticación se rompe en silencio.

**Cómo se arregla:**

```ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsuariosService } from '../../users/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usuariosService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
```

**Verificación:**
- Borrar `JWT_SECRET` del `.env` → la app debe fallar al iniciar.
- Cambiar el secreto en `.env` → tokens viejos dejan de funcionar (responden 401).

---

### 2. Eliminar o proteger `POST /usuarios`

**Archivo:** `perfumeria-backend/src/users/usuarios.controller.ts`

**Problema actual:**

```ts
@Post()
create(@Body() dto: CrearUsuarioDto) {
  return this.usuariosService.create(dto);
}
```

Sin `@UseGuards`, este endpoint es público. Cualquier persona puede:
1. Crear usuarios arbitrarios sin pasar por `/auth/register`.
2. Mandar un `passwordHash` precomputado (ya que el DTO expone ese campo) y saltarse bcrypt.
3. En el futuro, si se agregara campo `role` al DTO, crearse a sí mismo como ADMIN.

**Por qué es crítico:** Es un bypass total del sistema de registro y un agujero de escalación de privilegios potencial.

**Cómo se arregla:**

**Opción recomendada:** Eliminar completamente este endpoint. Solo `/auth/register` debería crear usuarios. Si un admin necesita crear cuentas manualmente, agregar más adelante un endpoint específico `POST /admin/usuarios` con todas las protecciones.

```ts
// usuarios.controller.ts — quitar el endpoint create completo
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() { ... }

  // ... resto sin @Post()

  // Borrar:
  // @Post()
  // create(@Body() dto: CrearUsuarioDto) { ... }
}
```

**Opción alternativa (si querés mantenerlo):**

```ts
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
create(@Body() dto: CrearUsuarioDto) {
  return this.usuariosService.create(dto);
}
```

Y refactorizar el DTO para que reciba `password` plano (ver mejora #5).

**Verificación:**
```bash
# Sin token, debe responder 401 (o 404 si lo borraste)
curl -X POST http://localhost:3001/usuarios -d '{...}'
```

---

### 3. Agregar `apellido` al interface `Usuario`

**Archivo:** `perfumeria-backend/src/users/interfaces/user.interface.ts`

**Problema actual:**

```ts
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  passwordHash: string;
  telefono: string | null;
  role: UserRole;
  activo: boolean;
  createdAt: Date;
  // ❌ Falta apellido
}
```

El schema de Prisma sí tiene `apellido`, pero el interface no. Esto rompe el tipado cuando `findByEmail()` retorna un Usuario completo — TypeScript piensa que no existe `apellido`.

**Por qué importa:** Si en el futuro hacés `user.apellido` en cualquier código que use este interface, el compilador se queja aunque el dato esté presente en runtime. Es una desincronización entre tipo y realidad.

**Cómo se arregla:**

```ts
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;   // ← agregar
  passwordHash: string;
  telefono: string | null;
  role: UserRole;
  activo: boolean;
  createdAt: Date;
}

export type UserRole = 'ADMIN' | 'USER';
```

**Verificación:**
- `findByEmail` debe seguir tipando correctamente.
- Cualquier uso de `user.apellido` ahora debe compilar sin errores.

---

## 🟡 IMPORTANTES

### 4. Unificar `@MinLength` de password (cierra fase 0.6)

**Archivos afectados:**
- `perfumeria-backend/src/auth/dto/register.dto.ts` → `@MinLength(6)`
- `perfumeria-backend/src/users/dto/crear-usuario.dto.ts` → `@MinLength(6)`
- `perfumeria-backend/src/auth/dto/login.dto.ts` → `@MinLength(8)`

**Problema:** Un usuario que se registra con 7 chars nunca puede loguearse.

**Cómo se arregla:** Elegir 8 como mínimo (alineado con NIST 800-63B) y actualizar los tres DTOs.

```ts
// register.dto.ts
@IsNotEmpty()
@IsString()
@MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
password: string;
```

**Verificación:**
- Registro con `"12345678"` → 200 OK
- Registro con `"1234567"` → 400 Bad Request
- Login con los mismos 8 chars → 200 OK

---

### 5. Separar `passwordHash` interno vs `password` público

**Archivo:** `perfumeria-backend/src/users/dto/crear-usuario.dto.ts`

**Problema actual:**

```ts
export class CrearUsuarioDto {
  @MinLength(6)
  passwordHash: string;   // ← Engañoso: en realidad espera password plano
}
```

El field se llama `passwordHash` pero en `auth.service.ts` se le pasa el resultado de `bcrypt.hash()`. El nombre miente sobre el contenido y, si el DTO se expone públicamente (como pasa hoy con `POST /usuarios`), permite enviar un hash pre-computado.

**Por qué importa:**
- Confusión al leer el código.
- Vector de ataque si el endpoint es público.
- Acoplamiento entre el contrato externo y el interno.

**Cómo se arregla:**

Crear un **tipo interno** (no DTO) para el contrato del service:

```ts
// perfumeria-backend/src/users/types/usuario-create-input.type.ts
export type UsuarioCreateInput = {
  nombre: string;
  apellido: string;
  email: string;
  passwordHash: string;   // ← Acá sí es un hash real
  telefono?: string;
};
```

Actualizar el service para usar este tipo:

```ts
// usuarios.service.ts
import { UsuarioCreateInput } from './types/usuario-create-input.type';

async create(input: UsuarioCreateInput): Promise<UsuarioResponse> {
  return this.prisma.usuario.create({
    data: {
      ...input,
      role: 'USER',
      activo: true,
    },
    select: usuarioSelectDefecto,
  });
}
```

`AuthService` no cambia (sigue pasando el hash). El `CrearUsuarioDto` se puede eliminar completamente si ya no hay endpoint que lo use.

**Verificación:**
- El compilador debe forzar que `AuthService.register` siga pasando un hash.
- El endpoint público `POST /usuarios` ya no debería existir (mejora #2).

---

### 6. Actualizar `ActualizarUsuarioDto`

**Archivo:** `perfumeria-backend/src/users/dto/actualizar-usuario.dto.ts`

**Problema actual:**

```ts
export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {}
```

Hereda el problema de `CrearUsuarioDto`: tiene `passwordHash` cuando en realidad espera password plano. El service lo re-hashea, pero el contrato externo es confuso.

**Cómo se arregla:**

Reescribir el DTO sin extender de `CrearUsuarioDto`:

```ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;   // ← Plano, el service lo hashea

  @IsOptional()
  @IsString()
  telefono?: string;
}
```

Y actualizar el service:

```ts
async update(id: number, dto: ActualizarUsuarioDto): Promise<UsuarioResponse> {
  const { password, ...rest } = dto;

  const updateData: Prisma.UsuarioUpdateInput = { ...rest };
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  return this.prisma.usuario.update({
    where: { id },
    data: updateData,
    select: usuarioSelectDefecto,
  });
}
```

**Verificación:**
- PATCH con `{ password: "nuevo123A" }` → hashea y actualiza.
- PATCH sin password → no toca `passwordHash`.
- PATCH con `{ passwordHash: "..." }` (intento malicioso) → ValidationPipe rechaza (whitelist).

---

### 7. Decidir política de pre-checks en `findOne`

**Archivos:** todos los services que tienen update/delete.

**Estado actual — inconsistente:**
- `usuarios.service.ts` → SIN pre-check (depende del filter para P2025).
- `marcas.service.ts` → CON pre-check (`await this.findOne(id)`).
- `categorias.service.ts` → CON pre-check.
- `productos.service.ts` → CON pre-check.
- `variantes.service.ts` → CON pre-check.

**El trade-off:**

| Con pre-check | Sin pre-check |
|---|---|
| Mensaje específico: `"Marca con ID 5 no encontrada"` | Mensaje genérico del filter: `"El registro solicitado no existe"` |
| Una query extra antes del update | Menos código, una query menos |
| Funciona aunque P2025 falle por algún motivo raro | Depende de que el filter siempre capture correctamente |

**Cómo se arregla:** Elegir una política y aplicarla en bloque.

**Recomendación:** Mantener los pre-checks (Opción B). Razones:
1. Los mensajes específicos son mejor UX.
2. El costo de la query extra es despreciable en este dominio.
3. Es más explícito al leer el código (sabés qué entidad estás buscando).

**Acción:** Agregar de nuevo `await this.findOne(id)` en `usuarios.service.ts`:

```ts
async update(id: number, dto: ActualizarUsuarioDto): Promise<UsuarioResponse> {
  await this.findOne(id);   // ← agregar

  // ... resto igual
}

async delete(id: number): Promise<void> {
  await this.findOne(id);   // ← agregar
  await this.prisma.usuario.update({
    where: { id },
    data: { activo: false },
  });
}
```

**Si elegís la Opción A (sin pre-checks):** quitar el `await this.findOne(id)` de `marcas`, `categorias`, `productos` y `variantes` también.

---

### 8. Quitar `ConflictException` huérfano

**Archivo:** `perfumeria-backend/src/auth/auth.service.ts`

**Problema:**

```ts
import {
  ConflictException,    // ← ya no se usa
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
```

Cuando removiste el chequeo manual de email duplicado, `ConflictException` quedó sin uso.

**Cómo se arregla:**

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
```

**Nota adicional sobre el diseño:** Al quitar el chequeo manual, dependés 100% del filter para detectar emails duplicados. El mensaje resultante es `"Ya existe un registro con ese valor en: email"` en lugar de `"El correo ya está registrado"`. Si preferís el mensaje custom, podés volver a poner el check:

```ts
const existingUser = await this.usuariosService.findByEmail(email);
if (existingUser) {
  throw new ConflictException('El correo ya está registrado');
}
```

Mantenelo si te importa más el mensaje. Quitalo si te importa más el código limpio. **Defense in depth** sugiere mantenerlo.

---

### 9. `roles.guard.ts` debe usar `ROLES_KEY`

**Archivo:** `perfumeria-backend/src/auth/guards/roles.guard.ts`

**Problema:**

```ts
const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
  'roles',   // ← magic string
  [context.getHandler(), context.getClass()],
);
```

En [role.decorator.ts:5](perfumeria-backend/src/auth/decorators/role.decorator.ts:5) se exporta una constante `ROLES_KEY = 'roles'` precisamente para evitar este string literal.

**Cómo se arregla:**

```ts
import { ROLES_KEY } from '../decorators/role.decorator';

// ...
const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
  ROLES_KEY,
  [context.getHandler(), context.getClass()],
);
```

**Verificación:** Los endpoints con `@Roles('ADMIN')` deben seguir funcionando exactamente igual. Si cambiás `ROLES_KEY` a otro string, los guards lo detectan automáticamente.

---

## 🟢 POLISH

### 10. `@HttpCode(200)` en `POST /auth/login`

**Archivo:** `perfumeria-backend/src/auth/auth.controller.ts`

**Problema:** NestJS responde `201 Created` por default a todo `@Post()`. Pero login no crea un recurso, autentica.

**Cómo se arregla:**

```ts
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // ...

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

`@Post('register')` sí merece `201` porque crea el usuario, así que ese se queda como está.

---

### 11. Corregir comentario en `role.decorator.ts`

**Archivo:** `perfumeria-backend/src/auth/decorators/role.decorator.ts`

**Problema:**

```ts
//Decorator recibe una lista de roles ('ADMIN,' 'CUSTOMER') y los pega a la ruta
```

`CUSTOMER` no existe. Los roles reales son `ADMIN` y `USER`.

**Cómo se arregla:**

```ts
// Decorator que recibe una lista de roles permitidos (ej: 'ADMIN', 'USER')
// y los adjunta como metadata a la ruta para que RolesGuard los lea
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

---

### 12. Refactor `AuthService` con helpers privados (DRY)

**Archivo:** `perfumeria-backend/src/auth/auth.service.ts`

**Problema:** `register()` y `login()` repiten exactamente el mismo bloque al final:

```ts
const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
return {
  access_token: this.jwtService.sign(payload),
  user: { id, email, nombre, role },
};
```

**Cómo se arregla:**

Extraer dos helpers privados:

```ts
private signToken(user: { id: number; email: string; role: UserRole }): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return this.jwtService.sign(payload);
}

private buildAuthResponse(user: {
  id: number;
  email: string;
  nombre: string;
  role: UserRole;
}) {
  return {
    access_token: this.signToken(user),
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      role: user.role,
    },
  };
}
```

Y ambos métodos públicos terminan con:

```ts
return this.buildAuthResponse(user);
```

**Beneficios:**
- Si el día de mañana querés agregar un campo al token o a la respuesta, lo tocás en un solo lugar.
- Más fácil de testear por separado.
- `register` y `login` quedan más claros: el "qué" arriba, el "cómo armar la respuesta" delegado.

---

## 🔜 PENDIENTES DE FASES FUTURAS

Estos están en el roadmap pero conviene tenerlos visibles acá para que no se pierdan.

### 13. `GET /usuarios/me` — Fase 2 (frontend auth)

Endpoint protegido que devuelve el usuario actual basado en el token. Necesario para que al recargar la app el frontend pueda hidratar el `AuthContext` sin pedirle login al usuario.

**Implementación tentativa:**

```ts
// usuarios.controller.ts
import { Request } from '@nestjs/common';
import { JwtUser } from '../auth/interfaces/jwt-user.interface';

@Get('me')
@UseGuards(JwtAuthGuard)
me(@Request() req: { user: JwtUser }) {
  return this.usuariosService.findOne(req.user.id);
}
```

---

### 14. `POST /auth/change-password` — Fase 5

Endpoint para que un usuario cambie su propia contraseña validando la anterior.

```ts
// auth.controller.ts
@Post('change-password')
@UseGuards(JwtAuthGuard)
@HttpCode(204)
async changePassword(
  @Request() req: { user: JwtUser },
  @Body() dto: ChangePasswordDto,
) {
  await this.authService.changePassword(
    req.user.id,
    dto.oldPassword,
    dto.newPassword,
  );
}
```

---

### 15. `POST /auth/refresh` — Fase 7

Refresh tokens. Requiere:
- Tabla nueva en schema: `RefreshToken { id, userId, token, expiresAt, revokedAt }`.
- Endpoint que recibe el refresh token, lo valida, lo rota y devuelve un nuevo access token.
- Migración a cookies httpOnly del lado del frontend.

---

### 16. Rate limiting con `nestjs-throttler` — Fase 7

Vulnerabilidad de fuerza bruta en `/auth/login` y `/auth/register`. Sin rate limit, alguien puede probar miles de combinaciones por segundo.

**Implementación tentativa:**

```bash
npm install @nestjs/throttler
```

```ts
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60_000,        // 60 segundos
      limit: 10,          // 10 requests por IP
    }]),
    // ... resto
  ],
})
```

Y en endpoints sensibles aplicar `@Throttle(5, 60)` para límites más estrictos.

---

## Orden sugerido de ejecución

| Orden | Item | Tiempo estimado |
|---|---|---|
| 1 | **#1** — Migrar `jwt.strategy.ts` a ConfigService | 3 min |
| 2 | **#2** — Quitar/proteger `POST /usuarios` | 3 min |
| 3 | **#3** — Agregar `apellido` a `Usuario` interface | 1 min |
| 4 | **#9** — `roles.guard.ts` con `ROLES_KEY` | 2 min |
| 5 | **#4** — Unificar password `MinLength(8)` | 2 min |
| 6 | **#5** — Separar `passwordHash` interno vs `password` público | 15 min |
| 7 | **#6** — Reescribir `ActualizarUsuarioDto` | 5 min |
| 8 | **#7** — Decidir política de pre-checks y aplicar | 5 min |
| 9 | **#8** — Quitar import muerto de `ConflictException` | 1 min |
| 10 | **#10** — `@HttpCode(200)` en login | 1 min |
| 11 | **#11** — Comentario en `role.decorator.ts` | 1 min |
| 12 | **#12** — Refactor `AuthService` con helpers | 10 min |

**Total estimado:** ~50 minutos para dejar Auth y Usuarios completamente limpios.

---

## Validación final (después de aplicar todo)

Checklist manual con Postman / curl:

- [ ] Borrar `JWT_SECRET` del `.env` → la app NO arranca.
- [ ] Restaurar `JWT_SECRET` → la app arranca.
- [ ] `POST /auth/register` con password de 7 chars → 400.
- [ ] `POST /auth/register` con password de 8 chars → 201 + token.
- [ ] `POST /auth/login` con esas credenciales → 200 + token.
- [ ] `POST /auth/login` con password incorrecta → 401 "Credenciales inválidas".
- [ ] `POST /auth/register` con email duplicado → 409 (mensaje del filter o custom según mejora #8).
- [ ] `POST /usuarios` sin token → 401 o 404 (según opción elegida en #2).
- [ ] `GET /usuarios` sin token → 401.
- [ ] `GET /usuarios` con token de USER → 403.
- [ ] `GET /usuarios` con token de ADMIN → 200.
- [ ] `PATCH /usuarios/:id` con `{ password: "..." }` → hashea correctamente.
- [ ] `PATCH /usuarios/:id` con `{ passwordHash: "..." }` → 400 (ValidationPipe rechaza).
- [ ] `PATCH /usuarios/999999` → 404 con mensaje específico (si elegiste mantener pre-checks).

---

## Notas finales

Cuando termines estas mejoras, el módulo de Auth y Usuarios queda en estado **production-ready** para el MVP. Los pendientes #13-#16 son features de fases siguientes, no deuda actual.

La mayoría de los problemas detectados son **inconsistencias acumuladas** de iteraciones pasadas, no errores de concepto. Resolverlos ahora previene que se propaguen al resto de los módulos cuando crezca el proyecto.
