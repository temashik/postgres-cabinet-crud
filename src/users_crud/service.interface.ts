import { User } from "../users_auth/entity";

export interface IUserCrudService {
	getAll: () => Promise<User[]>;
	getOne: (id: number) => Promise<User | null>;
	updateUser: (dto: IUpdateAnyUserData) => Promise<boolean>;
	deleteUser: (userId: number) => Promise<boolean>;
}

export interface IUpdateAnyUserData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	isAdmin: boolean;
	updateId: number;
}
