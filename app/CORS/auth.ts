
// import 'regenerator-runtime/runtime'
import 'whatwg-fetch'
import { SessionKey, accessTokenKey, refreshTokenKey, expiredKey } from './entities/SessionKey'
import { AccessData } from "./entities/AccessData";

//export const server: string = 'http://81.177.48.80';
export const server: string = 'https://audi-don.ru';
export const port: string = '50500';
const passwordHash: string = 'f7f8e967f2756082ada759e8e189e772e00a1deb13583e9beee02ad9a5420fda5ce2069e942cdc22a8cae4ecb90ace005737c6c96dd655330f0f1ae6a0ffd8fc';
const login: string = 'USER_FOR_SITE';
export const signInEndpoint: string = '/api/v1/tokens/signin';
export const refreshEndpoint: string = '/api/v1/tokens/refresh';
export const dataApiEndpoint: string = 'data_api'


class Auth {
	private accessData: AccessData;
	private token: SessionKey = { [accessTokenKey]: '', [refreshTokenKey]: '', [expiredKey]: 0 };
	// --------------------------------------------------------------------------------------------
	private async readFromSessionStorage(keys: string[]): Promise<SessionKey> {
		if (window) {
			const aTK: string | null = sessionStorage.getItem(accessTokenKey);
			const rTK: string | null = sessionStorage.getItem(refreshTokenKey);
			const eTK: string | null = sessionStorage.getItem(expiredKey);
			const resObj: SessionKey = {
				[accessTokenKey]: aTK ? aTK : '',
				[refreshTokenKey]: rTK ? rTK : '',
				[expiredKey]: eTK ? parseInt(eTK, 10) : 0,
			}
			return resObj;
		}
		else 
			return {[accessTokenKey]:"",[refreshTokenKey]:"",[expiredKey]:0};

	}
	// --------------------------------------------------------------------------------------------
	private async getSavedSecret(): Promise<SessionKey | undefined> {
		const savedToken: SessionKey = await this.readFromSessionStorage([accessTokenKey, refreshTokenKey, expiredKey]);
		if (!savedToken[accessTokenKey] || !savedToken[refreshTokenKey] || !savedToken[expiredKey])
			return undefined;
		else
			return savedToken;
	}
	// --------------------------------------------------------------------------------------------
	constructor(accessData: AccessData) {
		this.accessData = accessData;
	}
	//---------------------------------------------------------------------------------------------
	private async getToken(): Promise<SessionKey> {
		if (!window) return this.token;
		const path = `${server}:${port}${signInEndpoint}`;
		const bdy = JSON.stringify(this.accessData);
		const token = await fetch(path, {
			method: 'POST',
			body: bdy,
			headers: { 'Content-Type': 'application/json' }
		}).then(res => res.json()).then(res => res);
		return token;
	}

	private async saveInSessionStorage(): Promise<void> {

		sessionStorage.setItem(accessTokenKey, this.token[accessTokenKey]);
		sessionStorage.setItem(refreshTokenKey, this.token[refreshTokenKey]);
		sessionStorage.setItem(expiredKey, this.token[expiredKey].toString());
	}
	private async saveSecret(): Promise<void> {
		this.saveInSessionStorage();
	}
	//---------------------------------------------------------------------------------------------
	private tokenExpired(token: SessionKey): boolean {
		return token[expiredKey] < Math.floor(Date.now() / 1000);
	}
	private async refreshToken(token: SessionKey): Promise<SessionKey> {
		if (!token || !token[refreshTokenKey]) {

			throw new Error('Refresh token failure');
		}

		const path = `${server}:${port}${refreshEndpoint}`;
		const bdy = JSON.stringify({
			Token: token[refreshTokenKey],
		});
		const newToken: SessionKey = await fetch(path, {
			method: 'POST',
			body: bdy,
			headers: { 'Content-Type': 'application/json' },
		}).then(res => res.json()).then(res => res);
		return newToken;
	}

	public async auth(): Promise<SessionKey> {
		const savedToken: SessionKey | undefined = await this.getSavedSecret();
		if (!savedToken) {
			this.token = await this.getToken();
			if (!this.token)
				throw new Error('codes.authFailure');
			await this.saveSecret();
			return this.token;
		}
		else if (this.tokenExpired(savedToken)) {
			this.token = await this.refreshToken(savedToken);
			if (!this.token)
				throw new Error('codes.authFailure');
			await this.saveSecret();
			return this.token;
		}
		else {
			this.token = savedToken;
			return this.token;
		}
	}

}
/**
 * @returns ключ доступа для включения в заголовок Authorization
 * */
export async function getAccess(): Promise<string> {
	const token: SessionKey = await new Auth({ PasswordHash: passwordHash, UserName: login, LongToken: true }).auth();
	return token[accessTokenKey];
}
