import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BaseContorller } from "../common/base.controller";
import { TYPES } from "../types";
import { IUserAuthController } from "./controller.interface";
import { AdminRegisterDto, UserLoginDto, UserRegisterDto } from "./dto";
import "dotenv/config";
import { IUserAuthService } from "./service.interface";

@injectable()
export class UserAuthController
	extends BaseContorller
	implements IUserAuthController
{
	constructor(
		@inject(TYPES.UserAuthService) private userService: IUserAuthService
	) {
		super();
		this.bindRoutes([
			{ path: "/login", method: "post", func: this.login },
			{ path: "/register", method: "post", func: this.register },
			{ path: "/logout", method: "post", func: this.logout },
			{
				path: "/registerAdmin",
				method: "post",
				func: this.registerAdmin,
			},
		]);
	}

	public async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response
	): Promise<void> {
		if (!req.body.email || !req.body.password) {
			res.json({
				errorMessage: "You must fill all fields",
			});
			return;
		}
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			res.json({
				errorMessage: "Your email or password is invalid",
			});
		} else if (result.id) {
			const accessToken = await this.userService.signAccessToken(
				result.email,
				result.id,
				result.isAdmin
			);
			const refreshToken = await this.userService.signRefreshToken(
				result.email,
				result.id,
				result.isAdmin
			);
			res.cookie("refreshToken", refreshToken);
			res.cookie("accessToken", accessToken);
			res.json({ accessToken });
		}
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response
	): Promise<void> {
		if (
			!req.body.firstName ||
			!req.body.lastName ||
			!req.body.email ||
			!req.body.password
		) {
			res.json({
				errorMessage: "You must fill all fields",
			});
			return;
		}
		const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
		const ok = re.exec(req.body.email);
		if (!ok) {
			res.json({
				errorMessage: "Enter valid email.",
			});
			return;
		}
		const result = await this.userService.createUser(req.body);
		if (!result) {
			res.json({
				errorMessage: "This email already registered",
			});
			return;
		} else {
			res.json({
				msg: "You successfully registered",
			});
		}
	}

	async registerAdmin(
		req: Request<{}, {}, AdminRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (
			!req.body.firstName ||
			!req.body.lastName ||
			!req.body.email ||
			!req.body.password
		) {
			res.json({
				errorMessage: "You must fill all fields",
			});
			return;
		}
		if (
			!req.body.rootPassword ||
			req.body.rootPassword != process.env.ROOT_PASSWORD
		) {
			res.json({
				errorMessage: "No correct root password provided",
			});
			return;
		}
		const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
		const ok = re.exec(req.body.email);
		if (!ok) {
			res.json({
				errorMessage: "Enter valid email.",
			});
			return;
		}
		const result = await this.userService.createUser(req.body);
		if (!result) {
			res.json({
				errorMessage: "This email already registered",
			});
			return;
		} else {
			res.json({
				msg: "You successfully registered",
			});
		}
	}

	logout(req: Request, res: Response): void {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.end();
	}
}
