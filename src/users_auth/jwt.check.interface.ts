import { IChechJWTTokenResponse } from "./jwt.check";

/**
 * Interface for validating and signing JWT tokens
 */
export interface ICheckJWT {
	check(
		accessToken: string,
		refreshToken: string
	): Promise<IChechJWTTokenResponse | null>;
}
