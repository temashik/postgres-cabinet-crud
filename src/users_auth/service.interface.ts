import { UserLoginDto, UserRegisterDto } from "./dto";
import { User } from "./entity";

export interface IUserAuthService {
	createUser: (dto: UserRegisterDto) => Promise<boolean>;
	createAdmin: (dto: UserRegisterDto) => Promise<boolean>;
	validateUser: (dto: UserLoginDto) => Promise<User | null>;
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
}

export interface IUserPayload {
	email: string;
	id: string;
	isAdmin: boolean;
}
