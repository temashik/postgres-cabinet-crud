import { injectable } from "inversify";
import { UserRegisterDto } from "../users_auth/dto";
import { User } from "../users_auth/entity";
import { IUpdateAnyUserData, IUserCrudService } from "./service.interface";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

@injectable()
export class UserCrudService implements IUserCrudService {
	async getAll(): Promise<User[]> {
		const prisma = new PrismaClient();
		try {
			const findResult = await prisma.user.findMany();
			const result = findResult.map((user) => {
				return new User(
					user.first_name,
					user.last_name,
					user.email,
					user.isAdmin,
					user.id
				);
			});
			prisma.$disconnect();
			return result;
		} catch (e) {
			console.log("error", e);
			prisma.$disconnect();
			return [];
		}
	}
	async getOne(id: number): Promise<User | null> {
		const prisma = new PrismaClient();
		try {
			const findResult = await prisma.user.findUnique({
				where: {
					id: id,
				},
			});
			prisma.$disconnect();
			if (findResult) {
				return new User(
					findResult.first_name,
					findResult.last_name,
					findResult.email,
					findResult.isAdmin,
					findResult.id
				);
			}
			return null;
		} catch (e) {
			console.log("error", e);
			prisma.$disconnect();
			return null;
		}
	}

	async updateUser({
		firstName,
		lastName,
		email,
		password,
		isAdmin,
		updateId,
	}: IUpdateAnyUserData): Promise<boolean> {
		const prisma = new PrismaClient();
		try {
			const findResult = await prisma.user.findFirst({
				where: {
					id: updateId,
				},
			});
			if (!findResult) {
				prisma.$disconnect();
				return false;
			}
			const existedUser = await prisma.user.findFirst({
				where: {
					email: {
						equals: email,
					},
				},
			});
			const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
			const ok = re.exec(email);
			let setEmail: string;
			if (existedUser || email == "" || !ok) {
				setEmail = findResult.email;
			} else {
				setEmail = email;
			}
			const newUser = new User(firstName, lastName, setEmail, isAdmin);
			const salt = Number(process.env.SALT) || 6;
			await newUser.setPassword(password, salt);
			await prisma.user.update({
				where: {
					id: updateId,
				},
				data: {
					first_name: newUser.firstName,
					last_name: newUser.lastName,
					email: newUser.email,
					password: newUser.password,
					isAdmin: newUser.isAdmin,
				},
			});
			prisma.$disconnect();
			return true;
		} catch (e) {
			console.log("error", e);
			prisma.$disconnect();
			return false;
		}
	}

	async deleteUser(userId: number): Promise<boolean> {
		const prisma = new PrismaClient();
		try {
			await prisma.user.delete({
				where: {
					id: userId,
				},
			});
			prisma.$disconnect();
			return true;
		} catch (e) {
			console.log("error", e);
			prisma.$disconnect();
			return false;
		}
	}
}
