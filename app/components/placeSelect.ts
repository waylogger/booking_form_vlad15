/**
 * @module placeSelect.ts
 * @description генерирует разметку для выбора места получения и возврата авто
*/

import { PlacesResponse } from "../CORS/entities/apiExchange/serverTypes";
import { option } from "../shared/sharedActions";
import * as shared from '../shared/sharedData';
import $ from 'jquery'
import { State } from '../state/state';

export function placeOptions(state: State): string {
	let resStr: string = '';
	state.getPlacesForReceiveAndReturnCars().places.forEach(
		(place) => resStr += option(`${place.title} + ${place.delivery_cost} ₽`)
	);
	$(`#${shared.domElementId.returnPlaceSelectId}`).html(resStr);
	$(`#${shared.domElementId.receivePlaceSelectId}`).html(resStr);
	return resStr;
}

export const selectPlace = (state: State): void => {
	$(`#${shared.domElementId.receivePlaceSelectId}`).on(
		'change',
		() => {
			let txt: any = $(`#${shared.domElementId.receivePlaceSelectId}`).val()?.toString().trim().split(' + ')[0];
			const customInx = state.getPlacesForReceiveAndReturnCars().places.findIndex((item)=>item.title.match(/ДРУГОЕ/));
			if (txt === state.getPlacesForReceiveAndReturnCars().places[customInx].title) {
				$(`#${shared.domElementId.receiveCustomPlaceInputId}`).removeClass('customPlace-hidden');
				$(`#${shared.domElementId.receiveCustomPlaceId}`).removeClass('customPlace-hidden')
				$(`#${shared.domElementId.receiveCustomPlaceId}`).removeClass('customPlace-wrap-start')
				$(`#${shared.domElementId.receiveCustomPlaceId}`).addClass('customPlace-visible')
			} else {
				$(`#${shared.domElementId.receiveCustomPlaceInputId}`).addClass('customPlace-hidden');
				$(`#${shared.domElementId.receiveCustomPlaceId}`).addClass('customPlace-hidden')
				$(`#${shared.domElementId.receiveCustomPlaceId}`).addClass('customPlace-wrap-start')
				$(`#${shared.domElementId.receiveCustomPlaceId}`).removeClass('customPlace-visible')
			}
		}
	);

	$(`#${shared.domElementId.returnPlaceSelectId}`).on(
		'change',
		() => {
			let txt: any = $(`#${shared.domElementId.returnPlaceSelectId}`).val()?.toString().trim().split(' + ')[0];
			const customInx = state.getPlacesForReceiveAndReturnCars().places.findIndex((item)=>item.title.match(/ДРУГОЕ/));
			if (txt === state.getPlacesForReceiveAndReturnCars().places[customInx].title) {
				$(`#${shared.domElementId.returnCustomPlaceInputId}`).removeClass('customPlace-hidden');
				$(`#${shared.domElementId.returnCustomPlaceId}`).removeClass('customPlace-hidden')
				$(`#${shared.domElementId.returnCustomPlaceId}`).removeClass('customPlace-wrap-end')
				$(`#${shared.domElementId.returnCustomPlaceId}`).addClass('customPlace-visible')
			} else {
				$(`#${shared.domElementId.returnCustomPlaceInputId}`).addClass('customPlace-hidden');
				$(`#${shared.domElementId.returnCustomPlaceId}`).addClass('customPlace-hidden')
				$(`#${shared.domElementId.returnCustomPlaceId}`).addClass('customPlace-wrap-end')
				$(`#${shared.domElementId.returnCustomPlaceId}`).removeClass('customPlace-visible')
			}
		}
	);
}






