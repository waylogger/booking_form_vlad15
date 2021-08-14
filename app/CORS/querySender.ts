import 'regenerator-runtime/runtime'
import { server, port, dataApiEndpoint, getAccess } from './auth'
import queryString from 'query-string';
import { BidCostResponse, CarListResponse, FreePeriodResponse, PlacesResponse } from './entities/apiExchange/serverTypes';
import $ from 'jquery';
import { BidCostRequest, BidCreateRequest, PeriodsRequest } from './entities/apiExchange/clientTypes';





export async function getRequestBuilder<T>(urlSuffix: string, query: string): Promise<T> {
	let url = '';
	query ? url = `${server}:${port}/${dataApiEndpoint}/${urlSuffix}?${query}`
		:
		url = `${server}:${port}/${dataApiEndpoint}/${urlSuffix}`;
	const token = await getAccess();
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
	});
	
	return res.json();
}

export async function getCarList(): Promise<CarListResponse> {
	const res: CarListResponse = await getRequestBuilder<CarListResponse>('car_list', '');
	if (res.result_code != 0)
		$(location).attr('href', '/');
	return res;
}
export async function getPlaceList() {
	const res: PlacesResponse = (await getRequestBuilder<PlacesResponse>('place_list', ''));
	if (res.result_code != 0)
		$(location).attr('href', '/');
	return res;
}


export async function getCost(reqObj: BidCostRequest): Promise<BidCostResponse> {
	return (await getRequestBuilder('bid_cost', queryString.stringify(reqObj, { arrayFormat: 'bracket' })));

}

export async function getCarPeriodList(reqObj: PeriodsRequest): Promise<FreePeriodResponse> {
	const res = (await getRequestBuilder<FreePeriodResponse>('car_period_list', queryString.stringify(reqObj)));
	if (res.result_code != 0)
		$(location).attr('href', '/');
	return res;
}


/*
export async function getTarrifs(reqObj) {
	return (await getRequestBuilder('tariff_list', queryString.stringify(reqObj))).cars;
}

export async function getCityList() {
	return (await getRequestBuilder('city_list', {})).cities;
}
export async function getServiceTypeList() {
	return getRequestBuilder('service_type_list', {});
}
export async function getServiceList() {
	return getRequestBuilder('service_list', {});
}
export async function getCarFreeList(reqObj) {
	const res = (await getRequestBuilder('car_free_list', queryString.stringify(reqObj))).cars;
	return res;
}

*/
export async function sendRequest(body: FormData ){
	const urlSuffix = 'bid_create';
	let url = `${server}:${port}/${dataApiEndpoint}/${urlSuffix}`;
	const token = await getAccess();
	const res = await fetch(url, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
		body: body,
		
	});
	return res.json();
}