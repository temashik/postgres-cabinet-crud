import { UserLoginDto, UserRegisterDto } from "./dto";
import { User } from "./entity";

/**
 * User auth service interface
 */
export interface IUserAuthService {
	createUser: (dto: UserRegisterDto) => Promise<boolean>;
	createAdmin: (dto: UserRegisterDto) => Promise<boolean>;
	validateUser: (dto: UserLoginDto) => Promise<User | null>;
}
