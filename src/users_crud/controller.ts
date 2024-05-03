import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BaseContorller } from "../common/base.controller";
import { TYPES } from "../types";
import { IUserCrudController } from "./controller.interface";
import "dotenv/config";
import { IUserCrudService } from "./service.interface";
import { CheckIfAdmin } from "../common/middlewares/checkIfAdmin.middleware";
import { IJWTService } from "../users_auth/jwt.service.interface";

@injectable()
export class UserCrudController
	extends BaseContorller
	implements IUserCrudController
{
	constructor(
		@inject(TYPES.UserCrudService) private userService: IUserCrudService,
		@inject(TYPES.JWTService) private jwtService: IJWTService
	) {
		super();
		this.bindRoutes([
			{
				path: "/getAll",
				method: "get",
				func: this.getAllForAdmin,
				middlewares: [new CheckIfAdmin()],
			},
			{
				path: "/getOne/:id",
				method: "get",
				func: this.getOneForAdmin,
				middlewares: [new CheckIfAdmin()],
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
				middlewares: [new CheckIfAdmin()],
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
				middlewares: [new CheckIfAdmin()],
			},
		]);
	}

	async getAllForAdmin(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.getAll();
		res.json(result);
	}

	async getOneForAdmin(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const id = Number(req.params.id);
		const result = await this.userService.getOne(id);
		if (result) {
			res.json(result);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	}

	async update(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const accessTokenData = this.jwtService.verifyAccessToken(
			req.cookies.accessToken
		);
		if (!accessTokenData) {
			const refreshTokenData = this.jwtService.verifyRefreshToken(
				req.cookies.refreshToken
			);
			if (!refreshTokenData) {
				res.status(401).json({
					message: "Unauthorized. Log in, please",
				});
				return;
			}
			const newAccessToken = await this.jwtService.signAccessToken(
				refreshTokenData.email,
				Number(refreshTokenData.id),
				refreshTokenData.isAdmin
			);
			const result = await this.userService.updateUser({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
				isAdmin: refreshTokenData.isAdmin,
				updateId: Number(refreshTokenData.id),
			});
			if (result) {
				res.cookie("accessToken", newAccessToken);
				res.json({ message: "User updated" });
			} else {
				res.cookie("accessToken", newAccessToken);
				res.status(400).json({ message: "User not updated" });
			}
		} else {
			const result = await this.userService.updateUser({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
				isAdmin: accessTokenData.isAdmin,
				updateId: Number(accessTokenData.id),
			});
			if (result) {
				res.json({ message: "User updated" });
			} else {
				res.status(400).json({ message: "User not updated" });
			}
		}
	}

	async updateAny(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const accessTokenData = this.jwtService.verifyAccessToken(
			req.cookies.accessToken
		);
		if (!accessTokenData) {
			const refreshTokenData = this.jwtService.verifyRefreshToken(
				req.cookies.refreshToken
			);
			if (!refreshTokenData) {
				res.status(401).json({
					message: "Unauthorized. Log in, please",
				});
				return;
			}
			const newAccessToken = await this.jwtService.signAccessToken(
				refreshTokenData.email,
				Number(refreshTokenData.id),
				refreshTokenData.isAdmin
			);
			const result = await this.userService.updateUser(req.body);
			if (result) {
				res.cookie("accessToken", newAccessToken);
				res.json({ message: "User updated" });
			} else {
				res.cookie("accessToken", newAccessToken);
				res.status(400).json({ message: "User not updated" });
			}
		} else {
			const result = await this.userService.updateUser(req.body);
			if (result) {
				res.json({ message: "User updated" });
			} else {
				res.status(400).json({ message: "User not updated" });
			}
		}
	}

	async deleteAny(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const accessTokenData = this.jwtService.verifyAccessToken(
			req.cookies.accessToken
		);
		if (!accessTokenData) {
			const refreshTokenData = this.jwtService.verifyRefreshToken(
				req.cookies.refreshToken
			);
			if (!refreshTokenData) {
				res.status(401).json({
					message: "Unauthorized. Log in, please",
				});
				return;
			}
			const newAccessToken = await this.jwtService.signAccessToken(
				refreshTokenData.email,
				Number(refreshTokenData.id),
				refreshTokenData.isAdmin
			);
			const result = await this.userService.deleteUser(req.body.deleteId);
			if (result) {
				res.cookie("accessToken", newAccessToken);
				res.json({ message: "User deleted" });
			} else {
				res.cookie("accessToken", newAccessToken);
				res.status(400).json({ message: "User not deleted" });
			}
		} else {
			const result = await this.userService.deleteUser(req.body.deleteId);
			if (result) {
				res.json({ message: "User deleted" });
			} else {
				res.status(400).json({ message: "User not deleted" });
			}
		}
	}

	async delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const accessTokenData = this.jwtService.verifyAccessToken(
			req.cookies.accessToken
		);
		if (!accessTokenData) {
			const refreshTokenData = this.jwtService.verifyRefreshToken(
				req.cookies.refreshToken
			);
			if (!refreshTokenData) {
				res.status(401).json({
					message: "Unauthorized. Log in, please",
				});
				return;
			}
			const newAccessToken = await this.jwtService.signAccessToken(
				refreshTokenData.email,
				Number(refreshTokenData.id),
				refreshTokenData.isAdmin
			);
			const result = await this.userService.deleteUser(
				Number(refreshTokenData.id)
			);
			if (result) {
				res.cookie("accessToken", newAccessToken);
				res.json({ message: "User deleted" });
			} else {
				res.cookie("accessToken", newAccessToken);
				res.status(400).json({ message: "User not deleted" });
			}
		} else {
			const result = await this.userService.deleteUser(
				Number(accessTokenData.id)
			);
			if (result) {
				res.json({ message: "User deleted" });
			} else {
				res.status(400).json({ message: "User not deleted" });
			}
		}
	}
}
