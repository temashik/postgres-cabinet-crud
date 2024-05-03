/**
 * Data transfer object for user login and register
 */
export interface UserLoginDto {
	email: string;
	password: string;
}

export interface UserRegisterDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface AdminRegisterDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	rootPassword: string;
}
