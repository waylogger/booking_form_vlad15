/**
 * @module timeSelect.ts
 * @description генерирует разметку для селекторов времени
*/

import eachMinuteOfInterval from "date-fns/eachMinuteOfInterval";
import { option } from "../shared/sharedActions";
import $ from 'jquery'
import { badDateEqualNull } from "../shared/sharedData";
import {isEqual} from 'date-fns'
import * as shared from '../shared/sharedData';
import { State } from '../state/state'

export function correctionSecondTimeAfterFirst(state: State): void {
	const selectedTime = $(`#${shared.domElementId.selectReceiveTimeId}`).val()?.toString().split(':').map(it => parseInt(it, 10));
	const firstDate = state.getFirstDateOfRange();

	if (!firstDate) return;
	const dt = new Date(firstDate);
	if (selectedTime && selectedTime[0])
		dt?.setHours(selectedTime[0])

	if (selectedTime && selectedTime[1])
		dt?.setMinutes(selectedTime[1])
	if (dt)
		state.filterCurrentCarForBookingBySelection(dt);
	const secondDate = state.getSecondDateOfRange();

	
	
	if (secondDate) {
		let arrayForGenerateHTML = state.getFreeTimeSlotsForReceiveAndReturnCar(secondDate);
		
		if (isEqual(firstDate,secondDate)) 
			for ( let i = 0; i < arrayForGenerateHTML.length; ++i) {
				const date = arrayForGenerateHTML[i];
				const hour = date.getHours();
				const min = date.getMinutes();

				if (hour > dt?.getHours()) {
					continue;
				}
				else if (hour < dt.getHours()) {
					arrayForGenerateHTML[i] = badDateEqualNull;
					continue;
				}
				else if (hour === dt.getHours() ) {
					if (min <= dt.getMinutes()) {
						arrayForGenerateHTML[i] = badDateEqualNull;
						continue;
					}

				}
			}
		timeSelectorBy15Min('return', shared.domElementId.selectReturnTimeId, arrayForGenerateHTML);
		$(`#${shared.domElementId.selectReturnTimeId}`).attr('disabled', null);
	}
}

export function  timeSelectorBy15Min (idModificator: string, domId: string, arrayForGenerateHTML: Date[]): string {

	const dateA = new Date(2021,1,1,0,0,0);
	const dateB = new Date(2021,1,2,0,0,0);
	const dateArr: Date[] =  eachMinuteOfInterval({start: dateA, end: dateB}, {step: 15});
	const shortTime: string[] = [];

	dateArr.forEach(
		(dt) => {
			shortTime.push(dt.toTimeString().slice(0,5));
		}
	);

	shortTime.splice(shortTime.length-1); //убираем 00:00 в конце дня, так как это уже следующий день
	
	let resStr = '';
	const isDisabled = true;
	shortTime.forEach(
		(str,inx) => {
			isEqual(arrayForGenerateHTML[inx],badDateEqualNull) ? resStr += option(str,`${str.replace(':','-')}-${idModificator}`,'',isDisabled) :
			resStr += option(str,`${str.replace(':','-')}-${idModificator}`,'',false,'10:00');
		}
	);
	$(`#${domId}`).html(resStr);

	return resStr;
}

