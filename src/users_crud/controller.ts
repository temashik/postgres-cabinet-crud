import e, { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BaseContorller } from "../common/base.controller";
import { TYPES } from "../types";
import { IUserCrudController } from "./controller.interface";
import "dotenv/config";
import { IUserCrudService } from "./service.interface";
import { CheckIfAdmin } from "../common/middlewares/checkIfAdmin.middleware";
import { IJWTService } from "../users_auth/jwt.service.interface";
import { ICheckJWT } from "../users_auth/jwt.check.interface";

/**
 * User CRUD controller
 */
@injectable()
export class UserCrudController
	extends BaseContorller
	implements IUserCrudController
{
	constructor(
		@inject(TYPES.UserCrudService) private userService: IUserCrudService,
		@inject(TYPES.JWTService) private jwtService: IJWTService,
		@inject(TYPES.CheckJWT) private checkJWT: ICheckJWT
	) {
		super();
		this.bindRoutes([
			{
				path: "/getAll",
				method: "get",
				func: this.getAllForAdmin,
				middlewares: [new CheckIfAdmin(checkJWT)],
			},
			{
				path: "/getOne/:id",
				method: "get",
				func: this.getOneForAdmin,
				middlewares: [new CheckIfAdmin(checkJWT)],
			},
			{
				path: "/update",
				method: "patch",
				func: this.update,
			},
			{
				path: "/updateAny",
				method: "patch",
				func: this.updateAny,
				middlewares: [new CheckIfAdmin(checkJWT)],
			},
			{
				path: "/delete",
				method: "delete",
				func: this.delete,
			},
			{
				path: "/deleteAny",
				method: "delete",
				func: this.deleteAny,
				middlewares: [new CheckIfAdmin(checkJWT)],
			},
		]);
	}
	/**\
	 * Get all users, accessable only for admins (field isAdmin = true)
	 */
	async getAllForAdmin(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!req.cookies.accessToken || !req.cookies.refreshToken) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const tokenCheckResult = await this.checkJWT.check(
			req.cookies.accessToken,
			req.cookies.refreshToken
		);
		if (tokenCheckResult === null) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const result = await this.userService.getAll();
		if (tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.json(result);
		} else {
			res.json(result);
		}
	}
	/**
	 * Get one user by id, accessable only for admins (field isAdmin = true)
	 */
	async getOneForAdmin(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!req.cookies.accessToken || !req.cookies.refreshToken) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const tokenCheckResult = await this.checkJWT.check(
			req.cookies.accessToken,
			req.cookies.refreshToken
		);
		if (tokenCheckResult === null) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const id = Number(req.params.id);
		const result = await this.userService.getOne(id);
		if (result && tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.json(result);
		} else if (result) {
			res.json(result);
		} else if (tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.status(404).json({ message: "User not found" });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	}

	/**
	 * Update user by id, updates only own account
	 */
	async update(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!req.cookies.accessToken || !req.cookies.refreshToken) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const tokenCheckResult = await this.checkJWT.check(
			req.cookies.accessToken,
			req.cookies.refreshToken
		);
		if (tokenCheckResult === null) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const result = await this.userService.updateUser({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			isAdmin: tokenCheckResult.accessTokenData.isAdmin,
			updateId: Number(tokenCheckResult.accessTokenData.id),
		});
		if (result && tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.json({ message: "User updated" });
		} else if (result) {
			res.json({ message: "User updated" });
		} else if (tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.status(400).json({ message: "User not updated" });
		} else {
			res.status(400).json({ message: "User not updated" });
		}
	}
	/**
	 * Update any user by id, accessable only for admins (field isAdmin = true)
	 */
	async updateAny(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!req.cookies.accessToken || !req.cookies.refreshToken) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		console.log("123");
		const tokenCheckResult = await this.checkJWT.check(
			req.cookies.accessToken,
			req.cookies.refreshToken
		);
		if (tokenCheckResult === null) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const result = await this.userService.updateUser(req.body);
		if (result && tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.json({ message: "User updated" });
		} else if (result) {
			res.json({ message: "User updated" });
		} else if (tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.status(400).json({ message: "User not updated" });
		} else {
			res.status(400).json({ message: "User not updated" });
		}
	}

	/**
	 * Delete any user by id, accessable only for admins (field isAdmin = true)
	 */
	async deleteAny(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!req.cookies.accessToken || !req.cookies.refreshToken) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const tokenCheckResult = await this.checkJWT.check(
			req.cookies.accessToken,
			req.cookies.refreshToken
		);
		if (tokenCheckResult === null) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const result = await this.userService.deleteUser(req.body.deleteId);
		if (result && tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.json({ message: "User deleted" });
		} else if (result) {
			res.json({ message: "User deleted" });
		} else if (tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.status(400).json({ message: "User not deleted" });
		} else {
			res.status(400).json({ message: "User not deleted" });
		}
	}

	/**
	 * Delete user by id and log out him by clearing cookies, deletes only own account
	 */
	async delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		if (!req.cookies.accessToken || !req.cookies.refreshToken) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const tokenCheckResult = await this.checkJWT.check(
			req.cookies.accessToken,
			req.cookies.refreshToken
		);
		if (tokenCheckResult === null) {
			res.status(401).json({
				message: "Unauthorized. Log in, please",
			});
			return;
		}
		const result = await this.userService.deleteUser(
			Number(tokenCheckResult.accessTokenData.id)
		);
		if (result && tokenCheckResult.newAccessToken) {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");
			res.json({ message: "User deleted" });
			res.end();
		} else if (result) {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");
			res.json({ message: "User deleted" });
			res.end();
		} else if (tokenCheckResult.newAccessToken) {
			res.cookie("accessToken", tokenCheckResult.newAccessToken);
			res.status(400).json({ message: "User not deleted" });
		} else {
			res.status(400).json({ message: "User not deleted" });
		}
	}
}
