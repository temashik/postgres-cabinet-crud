import { hash, compare } from "bcryptjs";

export class User {
	private _password: string | undefined;
	constructor(
		private readonly _firstName: string,
		private readonly _lastName: string,
		private readonly _email: string,
		private readonly _isAdmin: boolean,
		private readonly _id?: number | undefined,
		passwordHash?: string
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get firstName(): string {
		return this._firstName;
	}

	get lastName(): string {
		return this._lastName;
	}

	get fullName(): string {
		return this._firstName + this._lastName;
	}

	get id(): number | undefined {
		return this._id;
	}

	get isAdmin(): boolean {
		return this._isAdmin;
	}

	get password(): string {
		if (this._password) return this._password;
		else return "no password";
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		if (this._password) return compare(pass, this._password);
		else return false;
	}
}
