import { Request, Response, NextFunction } from "express";

/**
 * Interface for user CRUD operations
 */
export interface IUserCrudController {
	getAllForAdmin: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	getOneForAdmin: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
