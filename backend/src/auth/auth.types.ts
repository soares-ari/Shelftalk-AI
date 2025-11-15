/**
 * Representa o usuário autenticado extraído do JWT.
 * Essa interface é usada em:
 * - JwtStrategy.validate()
 * - @CurrentUser()
 * - Rotas protegidas
 */
export interface AuthUser {
  id: string;
  email: string;
}
