/**
 * @module carSelect.ts
*/

import $ from 'jquery';
import { State } from '../state/state';
import { option, clearColor, formatCarModelFromBaseToSelect, formatCarModelFromSelectToHash, formatCarModelFromHashToSelect } from '../shared/sharedActions';
import * as shared from '../shared/sharedData';
import _ from 'lodash';
import { CalendarInjector } from './Calendar/CalendarInjector';






export const carSelect = async (state: State): Promise<void> => {


	const addr = location.pathname;
	let modelName = addr.replace(/.*\//g, '');
	
	let resStr = '';
	const cars = state.getAllCarsForRent().cars;

	const modelArr: string[] = [];

	cars.forEach(
		(car) => {
			const c = formatCarModelFromBaseToSelect(car.model);
			modelArr.push(
				c.trim()
			);
		}
	);

	const selArray: string[] = _.uniq(modelArr).map(
		(item: string, inx) => {
			let carName = '';
			if (item.match(/Mkpp/)) carName = item.replace('Mkpp',"МКПП");
			else if (item.match(/Akpp/)) carName = item.replace('Akpp',"АКПП");
			else
				carName = item;

			modelName = modelName.replace('mkpp', 'МКПП');
			modelName= modelName.replace('akpp','АКПП');
				
			return modelName ? 
			 option(carName, carName.toLowerCase().replace(/\s/g, '_'),'',false, formatCarModelFromHashToSelect(modelName))
			: option(carName, carName.toLowerCase().replace(/\s/g, '_')); 
		}
	);
	resStr += selArray.join('\n');

	$(`#${shared.domElementId.carSelectId}`).html(resStr);
	if (modelName)
		$(`#${shared.domElementId.carSelectId}`).attr('disabled','disabled');

	$(`#${shared.domElementId.carSelectId}`).on('change', async () => {
		
		let stringValueFromSelect = $(`#${shared.domElementId.carSelectId}`).val()?.toString();
		stringValueFromSelect = stringValueFromSelect?.replace('МКПП','Mkpp');
		stringValueFromSelect = stringValueFromSelect?.replace('АКПП','Akpp');
		
		
		$(`#${shared.domElementId.bookModuleId}`).removeClass('carNotSelect');
		if (state.isFirstDateOfRangeWasSelect())
			state.dropFirstDateOfRange();

		if (state.isSecondDateOfRangeWasSelect())
			state.dropSecondDateOfRange();

		await state.selectCar(stringValueFromSelect);
		await CalendarInjector(state);
		
	})
	$(`#${shared.domElementId.carSelectId}`).trigger('change');

	
}