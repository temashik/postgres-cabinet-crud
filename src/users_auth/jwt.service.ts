import { injectable } from "inversify";
import { IJWTService, IUserPayload } from "./jwt.service.interface";
import { sign, verify } from "jsonwebtoken";
import "dotenv/config";

@injectable()
export class JWTService implements IJWTService {
	async signAccessToken(
		email: string,
		id: number,
		isAdmin: boolean
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
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
				},
				(err, token) => {
					if (err) reject(err);
					else if (token) resolve(token);
				}
			);
		});
	}

	verifyAccessToken(token: string): IUserPayload | null {
		try {
			const { email, id, isAdmin } = verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!
			) as IUserPayload;
			return { email, id, isAdmin };
		} catch (err) {
			return null;
		}
	}

	async signRefreshToken(
		email: string,
		id: number,
		isAdmin: boolean
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					id,
					isAdmin,
					iat: Math.floor(Date.now() / 1000),
				},
				process.env.REFRESH_TOKEN_SECRET!,
				{
					algorithm: "HS256",
					expiresIn: "7d",
				},
				(err, token) => {
					if (err) reject(err);
					else if (token) {
						resolve(token);
					}
				}
			);
		});
	}

	verifyRefreshToken(token: string): IUserPayload | null {
		try {
			const { email, id, isAdmin } = verify(
				token,
				process.env.REFRESH_TOKEN_SECRET!
			) as IUserPayload;
			return { email, id, isAdmin };
		} catch (err) {
			return null;
		}
	}
}
