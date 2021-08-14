import eachMinuteOfInterval from "date-fns/eachMinuteOfInterval";
import { findLastKey } from "lodash";
import { isDoStatement, isFunctionDeclaration } from "typescript";
import { domElementId } from "./sharedData";
import $ from 'jquery'

/**
 * @module sharedActions.ts
 * @description некоторые переиспользуемые функции
*/
export function option(text: string, id: string = '', className: string = '', isDisabled: boolean = false, selectedValue: string = ''): string {
	if (!isDisabled && selectedValue === text)
		return  `<option id="${id}" class="${className}" selected="selected">${text}</option>`;
	
	return isDisabled ? `<option id="${id}" class="${className}" disabled>${text}</option>` : `<option id="${id}" class="${className}">${text}</option>`;
}

/**
 * @param model имя машины, которое получаем от сервера в формате: Toyota Rav4(бел.)
 * @returns то же имя, но без цвета в скобках
*/
export function clearColor(model: string): string {
	return model.replace(/\([^)]+\)/, '');
}
//--------------------------------------------------------------------------------------------------------
// форматирование имени авто из hash, от сервера и из select
export function formatCarModelFromBaseToSelect(model: string): string {
	return clearColor(model.trim().toLocaleLowerCase()).split(' ').map(
		(item) => `${item.charAt(0).toUpperCase()}${item.slice(1, item.length)}`
	).join(' ').trim();
}

export function formatCarModelFromSelectToHash(model: string) {
	return model.toLocaleLowerCase().replace(/\s/g, '_');
}

export function formatCarModelFromHashToSelect(model: string) {
	return model.replace(/_/g,' ').split(' ').map(
		(item) => `${item.charAt(0).toUpperCase()}${item.slice(1, item.length)}`
	).join(' ');
}
//--------------------------------------------------------------------------------------------------------
/**
 * @function
 * @param {Date} start
 * @param {Date} end
 * @returns {string} duration
 * @example ('01-01-2000 10:00', '02-01-2000 10:00') => (на 1 день с 01.01.2000 г. 10:00 по 02.02.2000 10:00)
 */
export function translateDate(d1: Date, d2: Date, t1: string | undefined, t2: string | undefined): string {
	// const numOfDays: number = Math.floor(((d2.valueOf() - d1.valueOf()) / 1000 / (24 * 3600)) + 1);
	// const numOfDaysStr: string = numOfDays.toString();
	// let dayWord: string = '';
	// let last2num: number = parseInt(numOfDaysStr, 10);
	// if (last2num >= 10 && last2num <= 19) {
	// 	dayWord = 'дней'
	// 	return `на ${numOfDaysStr} ${dayWord} с ${d1.toLocaleDateString()} ${t1} по ${d2.toLocaleDateString()} ${t2}`;
	// }
	// let lastNum: number = parseInt(numOfDaysStr.charAt(numOfDaysStr.length - 1), 10);
	// if (lastNum === 1) dayWord = 'день';
	// else if (lastNum === 0) dayWord = 'дней';
	// else if (lastNum > 1 && lastNum < 5) dayWord = 'дня';
	// else if (lastNum >= 5) dayWord = 'дней';
	return `${d1.toLocaleDateString()} ${t1} по ${d2.toLocaleDateString()} ${t2}`;
}

/**
 * @description получаем текущий date в формате для сервера: yyyy-mm-dd hh:mm:ssZ
*/

export function dateForServer(customDate: Date = new Date()): string {
	return `${customDate.toLocaleDateString().split('.').reverse().join('-')} ${customDate.toLocaleTimeString()}Z`;
}

export function customDateForServer(customDate: Date): string {
	return `${customDate.toLocaleDateString().split('.').reverse().join('-')} ${customDate.toLocaleTimeString()}Z`;
}

export function currentYearForServer(): string {
	const dt = new Date();
	dt.setMonth(0);
	dt.setDate(1);
	dt.setHours(0);
	dt.setMinutes(0);
	dt.setSeconds(0);
	dt.setMilliseconds(0);
	return dateForServer(dt);
}

export function nextYearForServer() {
	const dt = new Date();
	dt.setFullYear(dt.getFullYear() + 1);
	dt.setMonth(0);
	dt.setDate(1);
	dt.setHours(0);
	dt.setMinutes(0);
	dt.setSeconds(0);
	dt.setMilliseconds(0);
	return dateForServer(dt);
}

export function splitDateByMinutes(dt: Date, minutes: number): Date[] {

	return eachMinuteOfInterval({ start: dt, end: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1) }, { step: minutes });
}

export function validateField(domId: string, domIdOfIndicator: string): boolean {
	const domElement = $(`#${domIdOfIndicator}`);

	const target: string | undefined | number | string[] = $(`#${domId}`).val();

	if (!target) {

		domElement.addClass(domElementId.incorrectFieldClass);
		domElement.removeClass(domElementId.correctFieldClass);
		return false;
	}
	domElement.removeClass(domElementId.incorrectFieldClass);
	domElement.addClass(domElementId.correctFieldClass);
	return true;

}

export function validateChecker(domId: string, domIdOfIndicator: string): boolean {
	const domElement = $(`#${domIdOfIndicator}`);
	const val: boolean | undefined =  $(`#${domId}`).is(':checked');
	
	if (!val) {
		domElement.addClass(domElementId.incorrectFieldClass);
		domElement.removeClass(domElementId.correctFieldClass);
		return false;
	}
	domElement.removeClass(domElementId.incorrectFieldClass);
	domElement.addClass(domElementId.correctFieldClass);
	return true;

}