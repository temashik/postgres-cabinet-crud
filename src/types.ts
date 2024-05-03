/**
 * Unique symblos for dependency injection
 */
export const TYPES = {
	Application: Symbol.for("Application"),
	UserAuthController: Symbol.for("UserAuthController"),
	UserAuthService: Symbol.for("UserAuthService"),
	UserCrudController: Symbol.for("UserCrudController"),
	UserCrudService: Symbol.for("UserCrudService"),
	JWTService: Symbol.for("JWTService"),
	CheckJWT: Symbol.for("CheckJWT"),
};
