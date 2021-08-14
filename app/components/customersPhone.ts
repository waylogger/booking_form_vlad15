/**
 * @module customersPhone.ts
*/


import $ from 'jquery'
import { validateField } from '../shared/sharedActions';
import * as shared from '../shared/sharedData';
import { State } from '../state/state';

/**
 * @description первый обязательный плюс и запрет на ввод других символов кроме чисел
*/
export const customersPhoneValidateAndSave = (state: State): void => {
	$(`#${shared.domElementId.customersPhoneId}`).on('focus', () => {
		const a: any = $(`#${shared.domElementId.customersPhoneId}`).val();
		if (a) $(`#${shared.domElementId.customersPhoneId}`).val(a)
		else $(`#${shared.domElementId.customersPhoneId}`).val('+7')
	});

	$(`#${shared.domElementId.customersPhoneId}`).on('input', () => {
		const a: any = '+' + $(`#${shared.domElementId.customersPhoneId}`).val()?.toString().replace(/[^\d]/g, '');
		$(`#${shared.domElementId.customersPhoneId}`).val(`${a}`);
	});


	$(`#${shared.domElementId.customersPhoneId}`).on('focusout', () => {
		state.saveCustomersPhone($(`#${shared.domElementId.customersPhoneId}`).val()?.toString());

		validateField(shared.domElementId.customersPhoneId, shared.domElementId.customersPhoneTextId);
	});

}