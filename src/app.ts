import express, { Express, json, urlencoded } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import "dotenv/config";
import { TYPES } from "./types";
import { UserAuthController } from "./users_auth/controller";
import { UserCrudController } from "./users_crud/controller";

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: number;

	constructor(
		@inject(TYPES.UserAuthController)
		private userController: UserAuthController,
		@inject(TYPES.UserCrudController)
		private userCrudController: UserCrudController
	) {
		this.app = express();
		this.port = +process.env.PORT!;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(urlencoded({ extended: false }));
		this.app.use(cookieParser());
	}

	useRoutes(): void {
		this.app.use("/", this.userController.router);
		this.app.use("/", this.userCrudController.router);
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		console.log("Running on port ", this.port);
		this.server = this.app.listen(this.port);
	}
}
