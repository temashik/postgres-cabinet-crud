import { Request, Response, NextFunction } from "express";

/**
 * Interface for user auth controller
 */
export interface IUserAuthController {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	register: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	registerAdmin: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>;
	logout: (req: Request, res: Response, next: NextFunction) => void;
}
