
/**
 * @module customersName.ts
*/
import $ from 'jquery'
import { validateField } from '../shared/sharedActions';
import * as shared from '../shared/sharedData';
import { State } from '../state/state';

/**
 * @description смысл преобразований имени в том, что недопускаются небуквенные символы и не пробелы
 * кроме того допускается только 2 слова, первый символ каждого слова преобразуется в верхний регистр
*/
export const nameValidateAndSave = (state: State) => {

	$(`#${shared.domElementId.custonersNameId}`).on('input', () => {
		let a: any = $(`#${shared.domElementId.custonersNameId}`).val()?.toString().replace(/[^А-я|\s|A-z]/g, '');
		a = a.split(' ').slice(0, 2).map((str: string) => {
			return `${String(str.charAt(0)).toUpperCase()}${str.slice(1, str.length)}`;
		}).join(' ');
		$(`#${shared.domElementId.custonersNameId}`).val(a);
	});
	$(`#${shared.domElementId.custonersNameId}`).on('focusout', () => {
		state.saveCustomersName($(`#${shared.domElementId.custonersNameId}`).val()?.toString())
		validateField(shared.domElementId.custonersNameId, shared.domElementId.customersNameTextId);
	}
	);
}




