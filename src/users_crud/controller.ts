import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BaseContorller } from "../common/base.controller";
import { TYPES } from "../types";
import { IUserCrudController } from "./controller.interface";
import "dotenv/config";
import { IUserCrudService } from "./service.interface";
import { CheckAccessToken } from "../common/middlewares/checkJWT.middleware";
import { verify } from "jsonwebtoken";
import { IUserPayload } from "../users_auth/service.interface";
import { CheckIfAdmin } from "../common/middlewares/checkIfAdmin.middleware";

@injectable()
export class UserCrudController
	extends BaseContorller
	implements IUserCrudController
{
	constructor(
		@inject(TYPES.UserCrudService) private userService: IUserCrudService
	) {
		super();
		this.bindRoutes([
			{
				path: "/getAll",
				method: "get",
				func: this.getAllForAdmin,
				middlewares: [new CheckAccessToken(), new CheckIfAdmin()],
			},
			{
				path: "/getOne/:id",
				method: "get",
				func: this.getOneForAdmin,
				middlewares: [new CheckAccessToken(), new CheckIfAdmin()],
			},
			{
				path: "/update",
				method: "patch",
				func: this.update,
				middlewares: [new CheckAccessToken()],
			},
			{
				path: "/delete",
				method: "delete",
				func: this.delete,
				middlewares: [new CheckAccessToken()],
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
		const { email, id, isAdmin } = verify(
			req.token,
			process.env.ACCESS_TOKEN_SECRET!
		) as IUserPayload;
		const result = await this.userService.updateUser(
			{
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
			},
			req.body.updateId,
			Number(id) //can pass here user id and create another method with custom id for admin
		);
		if (result) {
			res.json({ message: "User updated" });
		} else {
			res.status(400).json({ message: "User not updated" });
		}
	}

	async delete(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const { email, id, isAdmin } = verify(
			req.cookies.accessToken,
			process.env.ACCESS_TOKEN_SECRET!
		) as IUserPayload;
		const result = await this.userService.deleteUser(
			Number(id),
			req.body.deleteId,
			isAdmin
		);
		if (result) {
			res.json({ message: "User deleted" });
		} else {
			res.status(400).json({ message: "User not deleted" });
		}
	}
}
