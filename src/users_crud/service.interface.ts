import { UserLoginDto, UserRegisterDto } from "../users_auth/dto";
import { User } from "../users_auth/entity";

export interface IUserCrudService {
	getAll: () => Promise<User[]>;
	getOne: (id: number) => Promise<User | null>;
	updateUser: (
		dto: UserRegisterDto,
		updateId: number,
		userId: number
	) => Promise<boolean>;
	deleteUser: (
		deleteId: number,
		userId: number,
		isAdmin: boolean
	) => Promise<boolean>;
}
