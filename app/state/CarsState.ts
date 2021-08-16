/**
 * @remarks управление частью общего состояния: выбором машин
 * */

import { CarListResponse, SingleCar} from  '../CORS/entities/apiExchange/serverTypes';
import { State } from './state'
import { transliterate } from 'transliteration'
import { formatCarModelFromBaseToSelect } from '../shared/sharedActions'
import { getCarList } from "../CORS/querySender";

const defultCarListResponse: CarListResponse = { result_code: 0, cars: [] };
/**
* @remarks - этот класс предназначен для управления всеми данными о машинах, которые получены от сервера, а также всеми преобразованиями этих данных
*
* */
export class CarsState {
	// work with cars
	/**
	* @remarks храним данные по всем авто, имеющимся на сервере
	* */
	private _allCarsForRent: CarListResponse = defultCarListResponse;

	/**
	* @remarks получение всех авто для бронирования, перед передачей данных происходит транслитерация строки с именем авто
	* */
	public get allCarsForRent(): CarListResponse {
		const res = this._allCarsForRent;
		res.cars.map(
			(
				car
			) => {
				car.model = transliterate(car.model);
			}
		)
		return { result_code: res.result_code, cars: res.cars };
	}

	public set allCarsForRent(allCars: CarListResponse) {
		this._allCarsForRent = allCars;	
	}

	/**
	 * @remarks имя авто, которое было выбрано через форму или URL
	* */
	private _selectedCarModelName: string = '';
	public get selectedCarModelName(): string {
		return this._selectedCarModelName;
	}
	public set selectedCarModelName(carModelName: string) {
		this._selectedCarModelName = carModelName;
	}
	/**
	* @remarks все авто, имя которых совпадает с selectedCarModelName
	* */
	private _allCarsForCurrentBooking: SingleCar[] = [];

	public set allCarsForCurrentBooking(cars: SingleCar[]) {
		this._allCarsForCurrentBooking = cars;
	}

	public get allCarsForCurrentBooking(): SingleCar[] {
		return this._allCarsForCurrentBooking;
	}

	/**
	* @remarks после загрузки формы под кнопкой "Забронировать" формируется строка 
	* с информацией о стоимости аренды, для расчета стоимости мне необходим id любого авто 
	* выбранного наименования.
	* */	
	public carIdForBidCost(): number {
		const randomId: number = 0;
		return this._allCarsForCurrentBooking[randomId].car_id;
	}
	/**
	* @remarks id авто, которое мы будем бронировать
	* */
	private _mainCarForBid: number = 0;
	public get mainCarForBid(): number {
		return this._mainCarForBid;
	}
	public set mainCarForBid(carId: number) {
	//	this._mainCarForBid = this.freePeriodsForCurrentBookingCarAfterFirstSelect[0].car_id;
		this._mainCarForBid = carId;
	}

	public async selectCar(nameOfCarFromCarSelectOrHash: string | undefined): Promise<void> {
		if (!nameOfCarFromCarSelectOrHash)
			return;
		//localdata			
		const carModelNamesForCompare: string[] = [];
		//step0 преобразуем имена для сравнения
		this.allCarsForRent.cars.forEach(
			(car) => {
				carModelNamesForCompare.push(formatCarModelFromBaseToSelect(car.model))
			}
		);

		//step1 фильтруем массив по совпадению с select
		this.allCarsForCurrentBooking = this.allCarsForRent.cars.filter(
			(_, inx) => {
				return carModelNamesForCompare[inx] === nameOfCarFromCarSelectOrHash
			}
		);

		this.selectedCarModelName = nameOfCarFromCarSelectOrHash;

	}
	// ----------------------------
	constructor( ){
	}
	public async init(){
		this.allCarsForRent = await getCarList();
		return this;
	}
	// ----------------------------
}
