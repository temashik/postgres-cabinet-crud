import { Request, Response, NextFunction } from "express";
/**
 * Interface for middleware
 */
export interface IMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
