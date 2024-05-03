import { injectable } from "inversify";
import { UserLoginDto, UserRegisterDto } from "./dto";
import { User } from "./entity";
import { IUserAuthService, IUserPayload } from "./service.interface";
import { PrismaClient } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import "dotenv/config";

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
			return true;
		} catch (e) {
			console.log("error", e);
			return false;
		}
	}

	async createAdmin({
		firstName,
		lastName,
		email,
		password,
	}: UserRegisterDto): Promise<boolean> {
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
					isAdmin: true,
				},
			});
			return true;
		} catch (e) {
			console.log("error", e);
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
				return newUser;
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	}

	async signAccessToken(
		email: string,
		id: number,
		isAdmin: boolean
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					id,
					isAdmin,
					iat: Math.floor(Date.now() / 1000),
				},
				process.env.ACCESS_TOKEN_SECRET!,
				{
					algorithm: "HS256",
					expiresIn: "10s",
				},
				(err, token) => {
					if (err) reject(err);
					else if (token) resolve(token);
				}
			);
		});
	}

	verifyAccessToken(token: string): IUserPayload | null {
		try {
			const { email, id, isAdmin } = verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!
			) as IUserPayload;
			return { email, id, isAdmin };
		} catch (err) {
			return null;
		}
	}

	async signRefreshToken(
		email: string,
		id: number,
		isAdmin: boolean
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					id,
					isAdmin,
					iat: Math.floor(Date.now() / 1000),
				},
				process.env.REFRESH_TOKEN_SECRET!,
				{
					algorithm: "HS256",
					expiresIn: "7d",
				},
				(err, token) => {
					if (err) reject(err);
					else if (token) {
						resolve(token);
					}
				}
			);
		});
	}
}
