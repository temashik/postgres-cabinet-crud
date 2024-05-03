import { User } from "../users_auth/entity";

/**
 * User CRUD service interface
 */
export interface IUserCrudService {
	getAll: () => Promise<User[]>;
	getOne: (id: number) => Promise<User | null>;
	updateUser: (dto: IUpdateAnyUserData) => Promise<boolean>;
	deleteUser: (userId: number) => Promise<boolean>;
}

/**
 * Interface for updating user data
 */
export interface IUpdateAnyUserData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	isAdmin: boolean;
	updateId: number;
}
