import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export interface ValidatedRequest<T = any> extends Request {
  validatedBody?: T;
  validatedQuery?: T;
  validatedParams?: T;
}

interface ValidationErrorResponse {
  error: string;
  validationErrors: Record<string, string[]>;
}

const formatZodErrors = (error: ZodError<any>): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};

  error.issues.forEach((issue: any) => {
    const path = issue.path.join(".");
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  });

  return formatted;
};

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: ValidatedRequest<T>, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodErrors(error);
        const response: ValidationErrorResponse = {
          error: "Request body validation failed",
          validationErrors,
        };
        return res.status(400).json(response);
      }

      return res.status(400).json({
        error: "Validation error",
        validationErrors: { unknown: ["An unexpected validation error occurred"] },
      });
    }
  };

export const validateQuery =
  <T>(schema: ZodSchema<T>) =>
  (req: ValidatedRequest<T>, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.validatedQuery = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodErrors(error);
        const response: ValidationErrorResponse = {
          error: "Query parameters validation failed",
          validationErrors,
        };
        return res.status(400).json(response);
      }

      return res.status(400).json({
        error: "Validation error",
        validationErrors: { unknown: ["An unexpected validation error occurred"] },
      });
    }
  };

export const validateParams =
  <T>(schema: ZodSchema<T>) =>
  (req: ValidatedRequest<T>, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.validatedParams = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodErrors(error);
        const response: ValidationErrorResponse = {
          error: "Route parameters validation failed",
          validationErrors,
        };
        return res.status(400).json(response);
      }

      return res.status(400).json({
        error: "Validation error",
        validationErrors: { unknown: ["An unexpected validation error occurred"] },
      });
    }
  };

export const validate = <T, Q, P>(bodySchema?: ZodSchema<T>, querySchema?: ZodSchema<Q>, paramsSchema?: ZodSchema<P>) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const errors: Record<string, string[]> = {};

    // Validate body if schema provided
    if (bodySchema) {
      try {
        const validated = bodySchema.parse(req.body);
        req.validatedBody = validated;
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodErrors(error);
          Object.assign(errors, formatted);
        }
      }
    }

    if (querySchema) {
      try {
        const validated = querySchema.parse(req.query);
        req.validatedQuery = validated;
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodErrors(error);
          Object.assign(errors, formatted);
        }
      }
    }

    if (paramsSchema) {
      try {
        const validated = paramsSchema.parse(req.params);
        req.validatedParams = validated;
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = formatZodErrors(error);
          Object.assign(errors, formatted);
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      const response: ValidationErrorResponse = {
        error: "Request validation failed",
        validationErrors: errors,
      };
      return res.status(400).json(response);
    }

    next();
  };
};
