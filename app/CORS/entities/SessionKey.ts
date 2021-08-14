/**
 * @module SessionKey.ts
*/

export const accessTokenKey = 'accessToken';
export const refreshTokenKey = 'refreshToken';
export const expiredKey ='expires';
export interface SessionKey {
    [accessTokenKey]: string,
    [refreshTokenKey]: string,
    [expiredKey]: number;
}
