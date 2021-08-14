/**
* @module bundle.ts
* */

import { renderBookingForm } from "./views/template";
import * as shared from './shared/sharedData'
import $ from 'jquery';
import { BookingState, State } from './state/state'
import { placeOptions, selectPlace } from "./components/placeSelect";
import { correctionSecondTimeAfterFirst } from "./components/timeSelect";
import { customersPhoneValidateAndSave } from "./components/customersPhone";
import { nameValidateAndSave } from "./components/customersName";
import { carSelect } from "./components/carSelect";
import { onPreview } from "./components/bidPreview";
import { createBid } from "./components/createBid";
import { validateChecker, validateField } from "./shared/sharedActions";
import { CalendarInjector } from "./components/Calendar/CalendarInjector";


// ================================================================================================
/**
 * @param state State of the applicaion
 * @description валидируем элементы формы: согласие, подтверждение и выбор места возврата/получения авто, даты
*/
export function validateElementsOfBookingForm(state: State): void {
	// checkers validation
	$(`#${shared.domElementId.proofOfAgeId}`).on('click', () => {
		const check = state.toggleAgeChecker();
		if (check)
			$(`#${shared.domElementId.ageAgree}`).attr('checked', 'true');
		else
			$(`#${shared.domElementId.ageAgree}`).attr('checked', null);

		validateChecker(shared.domElementId.ageAgree, shared.domElementId.proofOfAgeId);
	})
	//-----------------------------------------------------------------------------------------
	$(`#${shared.domElementId.proofOfPolicyId}`).on('click', () => {
		const check = state.togglePolicyChecker();
		if (check)
			$(`#${shared.domElementId.policyAgree}`).attr('checked', 'true');
		else
			$(`#${shared.domElementId.policyAgree}`).attr('checked', null);


		validateChecker(shared.domElementId.policyAgree, shared.domElementId.proofOfPolicyId);
	})
	//-----------------------------------------------------------------------------------------
	// select place validation
	$(`#${shared.domElementId.receiveCustomPlaceInputId}`).on('focusout', () => {
		validateField(shared.domElementId.receiveCustomPlaceInputId, shared.domElementId.receiveCustomTextId);
	});
	//-----------------------------------------------------------------------------------------
	$(`#${shared.domElementId.returnCustomPlaceInputId}`).on('focusout', () => {
		validateField(shared.domElementId.returnCustomPlaceInputId, shared.domElementId.returnCustomTextId);
	});
	//-----------------------------------------------------------------------------------------
	$(`#${shared.domElementId.receiveDataId}`).on('change', () => {
		validateField(shared.domElementId.receiveDataId, shared.domElementId.receiveDateTextId);
	});
	//-----------------------------------------------------------------------------------------
	$(`#${shared.domElementId.returnDataId}`).on(
		'change',
		() => {
			validateField(shared.domElementId.returnDataId, shared.domElementId.returnDateTextId);
		});
}
// ================================================================================================
/**
 * @description связывание элементов формы с обработчиками
*/
export function bindingDOMEventsAndHandlers(state: State): void {
	validateElementsOfBookingForm(state);
	// ----------------------------------------------------------------------------------------
	//после выбора времени получения авто необходимо скорректировать возможное премя его возврата, например, если получение и возврат в один день, то все даты ранее даты получения должны быть недоступны для возврата
	$(`#${shared.domElementId.selectReceiveTimeId}`).on('change', () => correctionSecondTimeAfterFirst(state))
	// ----------------------------------------------------------------------------------------
	// изменение состояния после выбора времени получения авто
	$(`#${shared.domElementId.selectReceiveTimeId}`).on('change', () => {
		let strT = $(`#${shared.domElementId.selectReceiveTimeId}`).val()?.toString().split(':');
		if (!strT) return;

		const h = parseInt(strT[0], 10);
		const m = parseInt(strT[1], 10);

		const timestamp = state.getFirstDateOfRange();
		timestamp.setHours(h);
		timestamp.setMinutes(m);
		state.setFirstTimeOfRange(timestamp)
	})
	// ----------------------------------------------------------------------------------------
	//тоже для времени возврата авто
	$(`#${shared.domElementId.selectReturnTimeId}`).on('change', () => {
		let strT = $(`#${shared.domElementId.selectReturnTimeId}`).val()?.toString().split(':');
		if (!strT) return;

		const h = parseInt(strT[0], 10);
		const m = parseInt(strT[1], 10);

		const timestamp = state.getSecondDateOfRange();
		timestamp.setHours(h);
		timestamp.setMinutes(m);
		state.setSecondTimeOfRange(timestamp)
		// после выбора времени возврата мы можем с чистой совестью определить машину, которая пойдет в бронь
		state.setMainCar();
	})
	// ----------------------------------------------------------------------------------------
	// связывание кнопки "Забронировать" с обработчиком брони
	$(`#${shared.domElementId.bookButtonId}`).on('click', () => createBid(state));
	// ----------------------------------------------------------------------------------------
	$('#' + `${shared.domElementId.receiveDataId}`).on('click', (e) => {
		$('#' + shared.domElementId.inputPickerId).addClass('ex-inputs-picker-visible');
		e.stopPropagation();

	});
	// ----------------------------------------------------------------------------------------
	$('#' + `${shared.domElementId.returnDataId}`).on('click', (e) => {
		$('#' + shared.domElementId.inputPickerId).addClass('ex-inputs-picker-visible');
		e.stopPropagation();
	})
	// ----------------------------------------------------------------------------------------
	// закрываем календарь при тычке в любом месте документа
	$(document).on('click', () => {
		$('#' + shared.domElementId.inputPickerId).removeClass('ex-inputs-picker-visible');
	});
}
// ================================================================================================
/**
 * @description функция инициализации приложения, которая отрисовавает форму, инициализирует состояние, загружает список машин, после чего инициализует компоненты приложения: валидацию форм, генерацию опций селектов, формирует превью, присоединяет календарь и назначает обработчики событий
*/
// -------------------------------------------------------------------------------------------------
export async function bundleBookingForm(): Promise<void> {

	renderBookingForm();
	const state = await BookingState();
	await carSelect(state);

	$.when($.ready).then(
		async () => {
			customersPhoneValidateAndSave(state);
			nameValidateAndSave(state);
			placeOptions(state);
			selectPlace(state);
			onPreview(state);
			CalendarInjector(state);
			bindingDOMEventsAndHandlers(state);
		}
	);
}
