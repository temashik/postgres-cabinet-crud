import { IMiddleware } from "./middleware.interface";
import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
import { IUserPayload } from "../../users_auth/service.interface";

export class CheckAccessToken implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		const accessToken = req.cookies.accessToken;
		if (accessToken) {
			try {
				verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
				req.token = accessToken;
				next();
			} catch (err: any) {
				if (err.message === "jwt expired") {
					console.log("expired");
					const refreshToken = req.cookies.refreshToken;
					if (refreshToken) {
						const result = this.refreshTokenHandler(refreshToken);
						if (!result) {
							res.json({
								msg: "No valid tokens. Please, log in.",
							});
							// next();
						} else {
							res.cookie("accessToken", result);
							req.token = result;
							// next();
						}
					}
				}

				next();
			}
		} else {
			const refreshToken = req.cookies.refreshToken;
			if (refreshToken) {
				const result = this.refreshTokenHandler(refreshToken);
				if (!result) {
					res.json({ msg: "No valid tokens. Please, log in." });
					next();
				} else {
					res.cookie("accessToken", result);
				}
			}
			next();
		}
	}

	private refreshTokenHandler(refreshToken: string): string | undefined {
		try {
			const { email, id, isAdmin } = verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET!
			) as IUserPayload;
			const newAccessToken = sign(
				{
					email,
					id,
					isAdmin,
					iat: Math.floor(Date.now() / 1000),
				},
				process.env.ACCESS_TOKEN_SECRET!,
				{
					algorithm: "HS256",
					expiresIn: "10s",
				}
			);
			return newAccessToken;
		} catch (err) {
			return undefined;
		}
	}
}
