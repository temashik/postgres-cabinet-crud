import { IMiddleware } from "./middleware.interface";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { IUserPayload } from "../../users_auth/service.interface";

export class CheckIfAdmin implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		const accessToken = req.cookies.accessToken;
		const { isAdmin } = verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET!
		) as IUserPayload;
		if (isAdmin) {
			next();
		} else {
			res.status(403).json({ message: "Forbidden" });
		}
	}
}
