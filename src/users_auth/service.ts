import { injectable } from "inversify";
import { UserLoginDto, UserRegisterDto } from "./dto";
import { User } from "./entity";
import { IUserAuthService } from "./service.interface";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

/**
 * User auth service
 */
@injectable()
export class UserAuthService implements IUserAuthService {
	async createUser({
		firstName,
		lastName,
		email,
		password,
	}: UserRegisterDto): Promise<boolean> {
		const newUser = new User(firstName, lastName, email, false);
		const salt = Number(process.env.SALT) || 6;
		await newUser.setPassword(password, salt);
		const prisma = new PrismaClient();
		try {
			const findResult = await prisma.user.findFirst({
				where: {
					email: {
						equals: email,
					},
				},
			});
			if (findResult) {
				return false;
			}
			await prisma.user.create({
				data: {
					first_name: newUser.firstName,
					last_name: newUser.lastName,
					email: newUser.email,
					password: newUser.password,
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

	/**
	 * Create user with admin rights
	 */
	async createAdmin({
		firstName,
		lastName,
		email,
		password,
	}: UserRegisterDto): Promise<boolean> {
		console.log("admin");
		const newUser = new User(firstName, lastName, email, true);
		const salt = Number(process.env.SALT) || 6;
		await newUser.setPassword(password, salt);
		const prisma = new PrismaClient();
		try {
			const findResult = await prisma.user.findFirst({
				where: {
					email: {
						equals: email,
					},
				},
			});
			if (findResult) {
				return false;
			}
			await prisma.user.create({
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

	async validateUser({
		email,
		password,
	}: UserLoginDto): Promise<User | null> {
		const prisma = new PrismaClient();
		try {
			const existedUser = await prisma.user.findFirst({
				where: {
					email: {
						equals: email,
					},
				},
			});
			if (existedUser === null) {
				return null;
			}
			const newUser = new User(
				existedUser.first_name,
				existedUser.last_name,
				existedUser.email,
				existedUser.isAdmin,
				existedUser.id,
				existedUser.password
			);
			if (await newUser.comparePassword(password)) {
				prisma.$disconnect();
				return newUser;
			} else {
				prisma.$disconnect();
				return null;
			}
		} catch (e) {
			prisma.$disconnect();
			return null;
		}
	}
}
