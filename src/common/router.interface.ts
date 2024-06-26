import { NextFunction, Request, Response, Router } from "express";
import { IMiddleware } from "./middlewares/middleware.interface";

/**
 * Interface for controller route
 */
export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, "get" | "post" | "patch" | "delete">;
	middlewares?: IMiddleware[];
}
