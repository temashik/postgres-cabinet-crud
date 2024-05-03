import { Router } from "express";
import { injectable } from "inversify";
import "reflect-metadata";
import { IControllerRoute } from "./router.interface";

@injectable()
export abstract class BaseContorller {
	private readonly _router: Router;

	constructor() {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			const middleware = route.middlewares?.map((mw) =>
				mw.execute.bind(mw)
			);
			const pipeline = [];
			const handler = route.func.bind(this);
			if (middleware) pipeline.push(...middleware);
			pipeline.push(handler);
			this.router[route.method](route.path, pipeline);
		}
	}
}
