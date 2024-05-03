/**
 * Interface for JWT service
 */
export interface IJWTService {
	signAccessToken: (
		email: string,
		id: number,
		isAdmin: boolean
	) => Promise<string>;
	verifyAccessToken: (token: string) => IUserPayload | null;
	signRefreshToken(
		email: string,
		id: number,
		isAdmin: boolean
	): Promise<string>;
	verifyRefreshToken: (token: string) => IUserPayload | null;
}

/**
 * Interface for payload from validating JWT
 */
export interface IUserPayload {
	email: string;
	id: string;
	isAdmin: boolean;
}
