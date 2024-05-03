import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { TYPES } from "./types";
import { UserAuthController } from "./users_auth/controller";
import { IUserAuthController } from "./users_auth/controller.interface";
import { CheckJWT } from "./users_auth/jwt.check";
import { ICheckJWT } from "./users_auth/jwt.check.interface";
import { JWTService } from "./users_auth/jwt.service";
import { IJWTService } from "./users_auth/jwt.service.interface";
import { UserAuthService } from "./users_auth/service";
import { IUserAuthService } from "./users_auth/service.interface";
import { UserCrudController } from "./users_crud/controller";
import { IUserCrudController } from "./users_crud/controller.interface";
import { UserCrudService } from "./users_crud/service";
import { IUserCrudService } from "./users_crud/service.interface";

/**
 * Interface for bootstrap return. Used only in this file
 */
export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

/**
 * Container module for app bindings
 */
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<IUserAuthController>(TYPES.UserAuthController)
		.to(UserAuthController)
		.inSingletonScope();
	bind<IUserAuthService>(TYPES.UserAuthService)
		.to(UserAuthService)
		.inSingletonScope();
	bind<IUserCrudController>(TYPES.UserCrudController)
		.to(UserCrudController)
		.inSingletonScope();
	bind<IUserCrudService>(TYPES.UserCrudService)
		.to(UserCrudService)
		.inSingletonScope();
	bind<IJWTService>(TYPES.JWTService).to(JWTService).inSingletonScope();
	bind<ICheckJWT>(TYPES.CheckJWT).to(CheckJWT).inSingletonScope();
});

/**
 * Boot the app
 */
async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
