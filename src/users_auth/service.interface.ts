import { UserLoginDto, UserRegisterDto } from "./dto";
import { User } from "./entity";

export interface IUserAuthService {
	createUser: (dto: UserRegisterDto) => Promise<boolean>;
	createAdmin: (dto: UserRegisterDto) => Promise<boolean>;
	validateUser: (dto: UserLoginDto) => Promise<User | null>;
}
