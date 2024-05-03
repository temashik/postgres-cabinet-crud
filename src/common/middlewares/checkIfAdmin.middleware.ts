import { IMiddleware } from "./middleware.interface";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { IUserPayload } from "../../users_auth/jwt.service.interface";
import { ICheckJWT } from "../../users_auth/jwt.check.interface";
import { inject } from "inversify";
import { TYPES } from "../../types";
/**
 * Middleware to check if the user is an admin
 */
export class CheckIfAdmin implements IMiddleware {
	constructor(@inject(TYPES.CheckJWT) private checkJWT: ICheckJWT) {}
	async execute(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const accessToken = req.cookies.accessToken;
		try {
			const { isAdmin } = verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET!
			) as IUserPayload;
			if (isAdmin) {
				next();
			} else {
				res.status(403).json({ message: "Forbidden" });
			}
		} catch (e: any) {
			const tokenData = await this.checkJWT.check(
				req.cookies.accessToken,
				req.cookies.refreshToken
			);
			if (!tokenData) {
				res.status(403).json({ message: "Forbidden" });
			} else {
				if (tokenData.accessTokenData.isAdmin) {
					next();
				} else {
					res.status(403).json({ message: "Forbidden" });
				}
			}
		}
	}
}
