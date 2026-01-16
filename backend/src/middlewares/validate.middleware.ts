import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware genérico de validação usando Zod
 * Valida req.body contra o schema fornecido
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida e sobrescreve req.body com dados validados
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata erros do Zod de forma legível
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          message: 'Erro de validação',
          errors,
        });
      }

      // Se não for erro do Zod, passa para o próximo middleware
      next(error);
    }
  };
}
