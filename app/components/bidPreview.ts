/**
 * @module bitText.ts
*/


import $ from 'jquery';
import { State } from '../state/state';
import * as shared from '../shared/sharedData';
import { translateDate } from '../shared/sharedActions';
import { BidCostRequest } from '../CORS/entities/apiExchange/clientTypes';
import { BidCostResponse, PlacesResponse, SingleCar, SinglePlace } from '../CORS/entities/apiExchange/serverTypes';
import { getCost } from '../CORS/querySender';

export async function bidPreview(state: State): Promise<void> {
	
	let carModel: String = state.getSelectedCarModelName();
	carModel = carModel.replace('Mkpp','МКПП');
	carModel = carModel.replace('Akpp','АКПП');
	
	const leftDate: string | undefined = $(`#${shared.domElementId.receiveDataId}`).val()?.toString();
	const leftTime: string | undefined = $(`#${shared.domElementId.selectReceiveTimeId}`).val()?.toString();
	const leftPlace: string | undefined = $(`#${shared.domElementId.receivePlaceSelectId}`).val()?.toString();
	const rightDate: string | undefined = $(`#${shared.domElementId.returnDataId}`).val()?.toString();
	const rightTime: string | undefined = $(`#${shared.domElementId.selectReturnTimeId}`).val()?.toString();
	const rightPlace: string | undefined = $(`#${shared.domElementId.returnPlaceSelectId}`).val()?.toString();

	
	let placeBegin: SinglePlace = state.getPlacesForReceiveAndReturnCars().places.filter(a => a.title === leftPlace?.split(' + ')[0])[0];
	let placeEnd: SinglePlace = state.getPlacesForReceiveAndReturnCars().places.filter(a => a.title === rightPlace?.split(' + ')[0])[0];


	const deliveryCost: number = placeBegin.delivery_cost + placeEnd.delivery_cost;
	
	if (carModel) {
		$(`#${shared.domElementId.carNameId}`).html(`Аренда: ${carModel}`);
	}

	if (leftPlace && rightPlace) {
		if (deliveryCost > 0)
			$(`#${shared.domElementId.deliveryCostId}`).html(
				` + доставка авто ${deliveryCost} ₽`
			);
		else {

			$(`#${shared.domElementId.deliveryCostId}`).html('');
		}
	}
	if (leftDate && leftTime && rightTime && rightDate) {
		let d1: string = `${leftDate.split('.').reverse().join('-')}T${leftTime}Z`;
		let d2: string = `${rightDate.split('.').reverse().join('-')}T${rightTime}Z`;


		const rentTime = `на период с ${translateDate(new Date(d1), new Date(d2), leftTime, rightTime)}`;
		$(`#${shared.domElementId.periodRentId}`).html(rentTime);

		const bidRequest: BidCostRequest = {
			car_id: state.carIdForBidCost(),
			begin: d1,
			end: d2,
			begin_place_id: placeBegin.place_id,
			end_place_id: placeEnd.place_id,
			services: [],
		}
		
		await getCost(bidRequest).then(
			(bidCost: BidCostResponse) => {
				
				const cost: number = bidCost.cost;
				let deposit: number = bidCost.deposit;
				if (deposit === null) deposit = 10000;
				let bidCostStr = `, cтоимость аренды ${cost - deliveryCost} ₽ + залог ${deposit} ₽ (возвращаем полностью по окончанию аренды)`;
				let resCostStr = `Итого: ${cost + deposit} ₽</span>`;
				$(`#${shared.domElementId.bidCostId}`).html(bidCostStr);
				$(`#${shared.domElementId.costResolutionId}`).html(resCostStr);
			}
		);
	}
	else {
		let bidCostStr = '';
		let resCostStr = '';
		const rentTime = '';
		$(`#${shared.domElementId.periodRentId}`).html(rentTime);
		$(`#${shared.domElementId.bidCostId}`).html(bidCostStr);
		$(`#${shared.domElementId.costResolutionId}`).html(resCostStr);
	}
}

export function onPreview(state: State): void {
	
	const onChangeList: string[] = [
		`${shared.domElementId.carSelectId}`,
		`${shared.domElementId.selectReceiveTimeId}`,
		`${shared.domElementId.selectReturnTimeId}`,
		`${shared.domElementId.receivePlaceSelectId}`,
		`${shared.domElementId.returnPlaceSelectId}`,
	];
	const onFocusList: string[] = [
		`${shared.domElementId.receiveDataId}`,
		`${shared.domElementId.returnDataId}`,
	]
	onChangeList.forEach((id: string) => {
		$(`#${id}`).on('change', () => {
			bidPreview(state);
			
		});
	});
	onFocusList.forEach((id: string) => {
		$(`#${id}`).on('change', () => {
			bidPreview(state);
		});
	});

	bidPreview(state);
}

