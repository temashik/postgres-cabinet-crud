import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IJWTService, IUserPayload } from "./jwt.service.interface";
import { ICheckJWT } from "./jwt.check.interface";

/**
 * Service to check if the JWT token is valid and ability to refresh an access token
 */
@injectable()
export class CheckJWT implements ICheckJWT {
	constructor(@inject(TYPES.JWTService) private jwtService: IJWTService) {}
	async check(
		accessToken: string,
		refreshToken: string
	): Promise<IChechJWTTokenResponse | null> {
		try {
			const accessTokenData =
				this.jwtService.verifyAccessToken(accessToken);
			if (!accessTokenData) {
				const newAccessToken = await this.refreshTokenHandler(
					refreshToken
				);
				if (!newAccessToken) {
					return null;
				}
				const newAccessTokenData =
					this.jwtService.verifyAccessToken(newAccessToken);
				if (!newAccessTokenData) {
					return null;
				}
				return {
					newAccessToken,
					accessTokenData: newAccessTokenData,
				};
			}
			return { newAccessToken: null, accessTokenData };
		} catch (err: any) {
			console.log(err.message === "jwt expired");
			if (err.message === "jwt expired") {
				console.log("expired");
				const result = await this.refreshTokenHandler(refreshToken);
				if (!result) {
					return null;
				} else {
					const newAccessTokenData =
						this.jwtService.verifyAccessToken(result);
					if (!newAccessTokenData) {
						return null;
					}
					return {
						newAccessToken: result,
						accessTokenData: newAccessTokenData,
					};
				}
			} else {
				return null;
			}
		}
	}

	/**
	 * Refreshes the access token
	 */
	private async refreshTokenHandler(
		refreshToken: string
	): Promise<string | undefined> {
		try {
			const refreshTokenData =
				this.jwtService.verifyRefreshToken(refreshToken);
			if (!refreshTokenData) {
				return undefined;
			}
			const newAccessToken = await this.jwtService.signAccessToken(
				refreshTokenData.email,
				Number(refreshTokenData?.id),
				refreshTokenData.isAdmin
			);
			return newAccessToken;
		} catch (err) {
			return undefined;
		}
	}
}

export interface IChechJWTTokenResponse {
	newAccessToken: string | null;
	accessTokenData: IUserPayload;
}
