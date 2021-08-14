/**
 * @module state.ts
*/
import 'regenerator-runtime/runtime';
import { CarListResponse, FreePeriodResponse, PlacesResponse, SingleCar, SinglePeriod } from "../CORS/entities/apiExchange/serverTypes"
import { getCarList, getPlaceList, getCarPeriodList } from "../CORS/querySender";
import { SingleCarWithPeriods } from '../entities/carPeriods';
import { formatCarModelFromBaseToSelect, formatCarModelFromHashToSelect, dateForServer, currentYearForServer, nextYearForServer, splitDateByMinutes, validateField, formatCarModelFromSelectToHash } from '../shared/sharedActions';
import * as shared from '../shared/sharedData'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval';
import _, { find, isEqual, lowerFirst } from 'lodash'
import { PeriodsRequest } from '../CORS/entities/apiExchange/clientTypes';
import $ from 'jquery'
import { DateRangePicker } from '../components/Calendar';
import { addHours, addMinutes, isAfter, isBefore } from 'date-fns';
import { correctionSecondTimeAfterFirst, timeSelectorBy15Min } from '../components/timeSelect';
import isWithinInterval from 'date-fns/isWithinInterval';
import { transliterate } from 'transliteration'
import { isReturnStatement, isThrowStatement } from 'typescript';


function trimPeriodBy3HoursOnEachSide(period: SinglePeriod): SinglePeriod {
	let begin = new Date(period.begin);
	let end = new Date(period.end);

	end = addMinutes(end, end.getTimezoneOffset());
	begin = addMinutes(begin, begin.getTimezoneOffset());

	//периоды менее 7 часов не обрезаются
	if (end.valueOf() - begin.valueOf() < 1000 * 60 * 60 * 6) return period;

	end = addHours(end, -3);
	begin = addHours(begin, 3);
	return { begin: begin, end: end };
}

function trimMultiplePeriodsBy3HoursOnEachSide(periods: SinglePeriod[]): SinglePeriod[] {
	return periods.map(el => trimPeriodBy3HoursOnEachSide(el));
}
function reformatPeriod(period: SinglePeriod): SinglePeriod {
	period.begin = period.begin.toString().replace(' ', 'T');
	period.end = period.end.toString().replace(' ', 'T');
	return period;
}
function reformatDateForIOS(periods: SinglePeriod[]): SinglePeriod[] {
	return periods.map(el => reformatPeriod(el));
}

function isWithinIntervals(periods: SinglePeriod[], timestamps: Date[]): boolean {
	const timeIsFound = true;
	const timeNotFound = false;

	for (let i = 0; i < timestamps.length; ++i) {
		const dt = timestamps[i];

		for (let j = 0; j < periods.length; ++j) {
			if (isWithinInterval(dt, {
				start: new Date(periods[j].begin),
				end: new Date(periods[j].end),
			})) {
				return timeIsFound;
			}
		}

	}
	return timeNotFound;
}

function isWithinIntervalsAndFindIt(periods: SinglePeriod[], timestamps: Date[]): SinglePeriod | undefined {
	const timeIsFound = true;
	const timeNotFound = undefined;

	const periodsMoreThen2Days = periods.filter(
		(period) => {
			return (new Date(period.end).valueOf() - new Date(period.begin).valueOf()) > 1000 * 60 * 60 * 24 * 2;
		}
	);

	//если период длится более 2 суток, то мне нужно произвести не более 2 сравнений: первого и последнего ts, если оба ts в периоде, то остальные 1438 ts можно не сравнивать 
	periodsMoreThen2Days.forEach(
		period => isAfter(timestamps[0], new Date(period.begin)) && isBefore(timestamps[timestamps.length - 1], new Date(period.end))

	);


	for (let i = 0; i < timestamps.length; ++i) {
		const dt = timestamps[i];

		for (let j = 0; j < periods.length; ++j) {
			if (isWithinInterval(dt, {
				start: new Date(periods[j].begin),
				end: new Date(periods[j].end),
			})) {
				return periods[j];
			}
		}

	}
	return timeNotFound;
}



const defultCarListResponse: CarListResponse = { result_code: 0, cars: [] };
const defaultPlacesResponse: PlacesResponse = { result_code: 0, places: [] }


export class State {

	private firstSelectedId: string = '';
	public setFirstSelectedId(id: string): void {
		this.firstSelectedId = id;
	}

	private secondSelectedId: string = '';
	public setSecondSelectedId(id: string): void {
		this.secondSelectedId = id;
	}


	private selectedMonthInx: number = new Date().getMonth();
	public setSelectedMonthInx(monthInx: number): void {
		this.selectedMonthInx = monthInx;
	}
	public incSelectedMonthInx(): void {
		if (this.selectedMonthInx === 11) {
			this.selectedYear++;
			this.selectedMonthInx = 0;
			return;
		}
		this.selectedMonthInx++;
	}

	public decSelectedMonthInx(): void {
		if (this.selectedMonthInx === 0) {
			this.selectedYear--;
			this.selectedMonthInx = 11;
			return;
		}
		this.selectedMonthInx = this.selectedMonthInx - 1;

	}



	public getSelectedMonthInx(): number {
		const ret = this.selectedMonthInx;
		return ret;
	}

	private selectedYear: number = new Date().getFullYear();
	public setSelectedYear(monthInx: number): void {
		this.selectedYear = monthInx;
	}

	public getSelectedYear(): number {
		const ret = this.selectedYear;
		return ret;
	}



	private selectedCarModelName: string = '';
	public getSelectedCarModelName(): String {
		return new String(this.selectedCarModelName);
	}

	private ageChecker: boolean = false;
	public toggleAgeChecker(): boolean {
		this.ageChecker = !this.ageChecker;
		return this.ageChecker;
	}

	private policyChecker: boolean = false;
	public togglePolicyChecker(): boolean {
		this.policyChecker = !this.policyChecker;
		return this.policyChecker;
	}



	private mainCarForBid: number = 0;
	public getMainCar(): number {
		return this.mainCarForBid;
	}

	//-----------------------------------------------------------------------------------------
	private firstDateOfRange: Date | undefined = undefined;

	public isFirstDateOfRangeWasSelect(): boolean {
		return this.firstDateOfRange ? true : false;
	}
	public getFirstDateOfRange() {
		if (this.firstDateOfRange)
			return new Date(this.firstDateOfRange)
		else return shared.badDateEqualNull;
	}
	public setFirstDateOfRange(timestampOfFirstSelectDate: Date): void {
		const arrayForGenerateHTML = this.getFreeTimeSlotsForReceiveAndReturnCar(timestampOfFirstSelectDate);
		this.firstDateOfRange = timestampOfFirstSelectDate;
		timeSelectorBy15Min('receive', shared.domElementId.selectReceiveTimeId, arrayForGenerateHTML);

		$(`#${shared.domElementId.selectReceiveTimeId}`).attr('disabled', null);

		$(`#${shared.domElementId.receiveDataId}`).val(this.getFirstDateOfRange().toLocaleDateString());
		$(`#${shared.domElementId.receiveDataId}`).trigger('change');

	}
	public dropFirstDateOfRange() {
		if (!this.isFirstDateOfRangeWasSelect()) return;
		
		$(`#${shared.domElementId.receiveDataId}`).val('');
		$(`#${shared.domElementId.selectReceiveTimeId}`).val('10:00');

		$(`#${shared.domElementId.selectReceiveTimeId}`).attr('disabled', 'disabled');
		this.freePeriodsForCurrentBookingCarAfterFirstSelect = this.freePeriodsForCurrentBookingCar;
		this.firstDateOfRange = undefined;

		$(`#${this.firstSelectedId}`).removeClass('dp-selected');
	}
	//-----------------------------------------------------------------------------------------

	private firstTimeOfRange: Date | undefined = undefined;
	public setFirstTimeOfRange(ftr: Date | undefined): void { this.firstTimeOfRange = ftr; }
	public getFirstTimeOfRange(): Date | undefined { const ftr = this.firstTimeOfRange; return ftr; }

	private secondTimeOfRange: Date | undefined = undefined;
	public setSecondTimeOfRange(ftr: Date | undefined): void { this.secondTimeOfRange = ftr; }
	public getSecondTimeOfRange(): Date | undefined {
		const ftr = this.secondTimeOfRange; return ftr;
	}

	private secondDateOfRange: Date | undefined = undefined;
	public isSecondDateOfRangeWasSelect(): boolean {
		return this.secondDateOfRange ? true : false;
	}
	public setSecondDateOfRange(timestampOfSecondSelectDate: Date): void {
		
		this.secondDateOfRange = timestampOfSecondSelectDate;
		const selectedTime = $(`#${shared.domElementId.selectReceiveTimeId}`).val()?.toString().split(':').map(it => parseInt(it, 10));
		const firstDate = this.getFirstDateOfRange();
		const dt = new Date(firstDate);
		if (selectedTime && selectedTime[0])
			dt?.setHours(selectedTime[0])

		if (selectedTime && selectedTime[1])
			dt?.setMinutes(selectedTime[1])
		if (dt)
			this.filterCurrentCarForBookingBySelection(dt);


		$(`#${shared.domElementId.selectReturnTimeId}`).attr('disabled', 'disabled');
		correctionSecondTimeAfterFirst(this);
		this.setMainCar();

		$(`#${shared.domElementId.returnDataId}`).val(this.getSecondDateOfRange().toLocaleDateString());
		$(`#${shared.domElementId.selectReceiveTimeId}`).trigger('change');


	}
	public dropSecondDateOfRange() {
		if (!this.isSecondDateOfRangeWasSelect()) return;
		$(`#${shared.domElementId.returnDataId}`).val('');
		$(`#${shared.domElementId.selectReturnTimeId}`).val('10:00');
		$(`#${shared.domElementId.selectReturnTimeId}`).attr('disabled', 'disabled');
		this.secondDateOfRange = undefined;

		$(`#${this.secondSelectedId}`).removeClass('dp-selected');
	}

	public getSecondDateOfRange() {

		if (this.secondDateOfRange) {
			const dt = new Date(this.secondDateOfRange);

			return dt;
		}
		else
			return shared.badDateEqualNull;
	}

	public dropDateState() {
		this.dropFirstDateOfRange();
		this.dropSecondDateOfRange();

		$(`#${shared.domElementId.receiveDataId}`).val('');
		$(`#${shared.domElementId.returnDataId}`).val('')

		$(`#${shared.domElementId.receiveDataId}`).trigger('change');
		$(`#${shared.domElementId.returnDataId}`).trigger('change');
		$(`#${shared.domElementId.carSelectId}`).trigger('change');
	}


	public setMainCar() {
		this.mainCarForBid = this.freePeriodsForCurrentBookingCarAfterFirstSelect[0].car_id;
	}
	/**
	 * @description адреса места для выдачи и возврата арендованных авто
	*/
	private placesForReceiveAndReturnCars: PlacesResponse = { result_code: 0, places: [] };
	/**
	 * @description все авто, доступные для бронирования у заказчика
	*/
	private allCarsForRent: CarListResponse = defultCarListResponse;
	/**
	 * @description все авто одной модели, которая бронируется в настоящее время
	*/
	private allCarsForCurrentBooking: SingleCar[] = [];

	public carIdForBidCost(): number {
		return this.allCarsForCurrentBooking[0].car_id;
	}
	/**
	 * @description телефон арендатора
	*/
	private customersPhone: string | undefined = '';
	/**
	 * @description телефон имя арендатора
	*/
	private customersName: string | undefined = '';
	/**
	 * массив данных, который содержит данные о периодах брони в отношении allCarsForCurrentBooking
	*/
	private busyPeriodsForCurrentBookingCar: SingleCarWithPeriods[] = [];
	/**
	 * @description массив данных, который содержит исходные значения периодов для текущих машин
	*/
	private freePeriodsForCurrentBookingCar: SingleCarWithPeriods[] = [];
	private freePeriodsForCurrentBookingCarAfterFirstSelect: SingleCarWithPeriods[] = [];
	public filterCurrentCarForBookingBySelection(timestamp: Date): void {

		const splitDate: Date[] = eachMinuteOfInterval({ start: timestamp, end: new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate() + 1) }, { step: 15 });

		this.freePeriodsForCurrentBookingCarAfterFirstSelect = this.freePeriodsForCurrentBookingCar.filter(
			(carsWithPeriods) => isWithinIntervals(carsWithPeriods.car_periods, splitDate)
		);

	}
	/**
	 * @description массив данных, который содержит исходные значения периодов для всех машин
	*/
	private freePeriodsForAllBookingCar: SingleCarWithPeriods[] = [];
	/**
	 * Массив дней, которые полностью недоступны для брони всех allCarsForCurrentBooking
	*/
	private fulldaysNotAvaivableForBooking: Date[] = [];
	/**
	 * Массив дней, которые частично недоступны для брони всех allCarsForCurrentBooking - ключи, значения - это массив недоступных отрезков по 15 мину
	*/
	private partedDayNotAvaiableForBooking: Date[][] = [];

	/**
	 * @description сервер принимет дату в виде "2021-11-01 10:00Z", поэтому timestamp требуется постоянно переводить в этот формат, для чего служит эта функция
	*/
	private reformatDate(dt: Date): string {
		return `${dt.toLocaleDateString().split('.').reverse().join('-')} ${dt.toLocaleTimeString()}Z`;
	}

	private async fetchFreePeriodsForAllCars(): Promise<void> {


		const carsIdOfAllCars: number[] = [];
		const promisesForFetctFreePeriodsDate: Promise<FreePeriodResponse>[] = [];
		this.allCarsForRent.cars.forEach((car) => { carsIdOfAllCars.push(car.car_id) });

		const beginDateForAllCars = currentYearForServer();
		const endDateForAllCars = nextYearForServer();

		carsIdOfAllCars.forEach(
			(id) => {
				const requestForFreePeriods: PeriodsRequest = {
					car_id: id,
					begin: beginDateForAllCars,
					end: endDateForAllCars,
					include_idles: true,
					include_reserves: true
				}
				promisesForFetctFreePeriodsDate.push(
					getCarPeriodList(requestForFreePeriods)
				);
			}
		)

		const resultOfFetchFreePeriods = await Promise.all(promisesForFetctFreePeriodsDate);
		resultOfFetchFreePeriods.forEach(
			(res, inx) => {
				res.car_periods = reformatDateForIOS(res.car_periods);

				this.freePeriodsForAllBookingCar.push({ ...this.allCarsForRent.cars[inx], car_periods: trimMultiplePeriodsBy3HoursOnEachSide(res.car_periods) })
			}
		);

		this.freePeriodsForCurrentBookingCar = this.freePeriodsForAllBookingCar.filter(
			(carPeriodItem: SingleCarWithPeriods) => {

				return this.allCarsForCurrentBooking.find((item: SingleCar, inx: number) => {

					return item.car_id === carPeriodItem.car_id ? true : false;
				})
			}
		);

		this.freePeriodsForCurrentBookingCarAfterFirstSelect = this.freePeriodsForCurrentBookingCar;


	}


	constructor() { }

	/**
	 * @description инициализация данных через асинхронные запросы
	*/
	public async init(): Promise<State> {
		const promises: Promise<any>[] = []
		// --------------------------------------------------
		promises.push(getPlaceList());
		promises.push(getCarList());

		const res = await Promise.all(promises);
		// список мест
		const places: PlacesResponse = res[0];

		places.places.splice(0, 3);//смысл убрать первые 3 элемента в том, что об этот попросил заказчик
		places.places = places.places.filter(
			(place) => !place.archive
		)
		this.placesForReceiveAndReturnCars = places;
		//список машин
		// --------------------------------------------------
		this.allCarsForRent = res[1]

		return this;
	}


	public getPlacesForReceiveAndReturnCars(): PlacesResponse {
		const places = this.placesForReceiveAndReturnCars;
		return { result_code: places.result_code, places: places.places };
	}

	public saveCustomersPhone(num: string | undefined): void {
		this.customersPhone = num;
	}

	public getCustomersPhone(): String | undefined {
		return new String(this.customersPhone).toString();
	}

	public saveCustomersName(name: string | undefined): void {
		this.customersName = name;

	}

	public getCustomersName(): String | undefined {
		return new String(this.customersName).toString();

	}

	public getAllCarsForRent(): CarListResponse {
		const res = this.allCarsForRent;
		res.cars.map(
			(
				car
			) => {
				// car.model = car.model.
				// console.log(transliterate(car.model));
				car.model = transliterate(car.model);



			}
		)
		return { result_code: res.result_code, cars: res.cars };

	}

	public async selectCar(nameOfCarFromCarSelectOrHash: string | undefined): Promise<void> {

		if (!nameOfCarFromCarSelectOrHash)
			return;
		//localdata			
		const carModelNamesForCompare: string[] = [];
		//step0 преобразуем имена для сравнения
		this.getAllCarsForRent().cars.forEach(
			(car) => {
				// console.log(formatCarModelFromSelectToHash(formatCarModelFromBaseToSelect(car.model)));
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
		await this.fetchFreePeriodsForAllCars();




	}

	private findFirstPeriodWhichConsistTimestamt(periods: SinglePeriod[], timestamp: Date): boolean {
		const findedPeriod: SinglePeriod | undefined = periods.find(
			(item) => {

				return isWithinInterval(timestamp, { start: new Date(item.begin), end: new Date(item.end) });
			}
		);
		return findedPeriod ? true : false;
	}

	public isDateBusy(dt: Date): Boolean {
		// console.log('busy');

		const splitDate: Date[] = eachMinuteOfInterval({ start: dt, end: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1) }, { step: 15 });
		let fourHoursContinuesDurationFounded = false;
		const dateIsBusy = true;
		const dateIsFree = false;
		const numberTimeSlotsInFourHours = 1 * 4; //one

		if (isBefore(dt, new Date())) return dateIsBusy;

		if (this.isSecondDateOfRangeWasSelect()) {
			const secondDate: Date | undefined = this.getSecondDateOfRange();

			if (secondDate && isAfter(dt, secondDate)) {
				return dateIsBusy;
			}

		}

		if (this.isFirstDateOfRangeWasSelect()) {

			if (!this.firstDateOfRange) return dateIsFree;

			if (this.firstDateOfRange)
				this.filterCurrentCarForBookingBySelection(this.firstDateOfRange);


			if (isBefore(dt, this.firstDateOfRange)) return dateIsBusy;

			let lastEndOfLatestInterval: Date = shared.badDateEqualNull;

			let findedPeriod: SinglePeriod[] = [];

			for (let i = 0; i < this.freePeriodsForCurrentBookingCarAfterFirstSelect.length; ++i) {

				const periods = this.freePeriodsForCurrentBookingCarAfterFirstSelect[i].car_periods;

				let slicePeriods = periods.filter(//оставляем только периоды, которые заканчиваются после начала сравнимого дня
					(period) => this.firstDateOfRange && isAfter(new Date(period.end), this.firstDateOfRange)
				);

				slicePeriods = slicePeriods.filter(//оставляем только те периоды, которые начинаются в течении сравнимого дня
					(period) => this.firstDateOfRange && isBefore(new Date(period.begin), new Date(this.firstDateOfRange).setDate(this.firstDateOfRange.getDate() + 1))
				);

				const finded = isWithinIntervalsAndFindIt(slicePeriods, splitDateByMinutes(this.firstDateOfRange, 15));
				if (finded) {

					findedPeriod.push(finded);

				}
			}
			findedPeriod.forEach((period: SinglePeriod) => {

				if (isAfter(new Date(period.end), lastEndOfLatestInterval)) lastEndOfLatestInterval = new Date(period.end);
			});

			if (isAfter(dt, lastEndOfLatestInterval)) {

				return dateIsBusy;
			}

			return dateIsFree;
		}

		this.freePeriodsForCurrentBookingCarAfterFirstSelect.forEach(
			(item, inx) => {
				let continuesDurationOfFreePeriods = 0;

				let slicePeriods = item.car_periods.filter(//оставляем только периоды, которые заканчиваются после начала сравнимого дня
					(period) => isAfter(new Date(period.end), splitDate[0])
				);

				slicePeriods = slicePeriods.filter(//оставляем только те периоды, которые начинаются в течении сравнимого дня
					(period) => isBefore(new Date(period.begin), splitDate[splitDate.length - 1])
				);

				for (let i = 0; i < splitDate.length; ++i) {

					const date = splitDate[i];
					if (continuesDurationOfFreePeriods >= numberTimeSlotsInFourHours) {
						break;

					}
					if (this.findFirstPeriodWhichConsistTimestamt(slicePeriods, date)) {

						continuesDurationOfFreePeriods += 1;
					}
					else {
						continuesDurationOfFreePeriods = 0;
					}
				}
				if (continuesDurationOfFreePeriods >= numberTimeSlotsInFourHours) fourHoursContinuesDurationFounded = true;
			}
		);
		if (fourHoursContinuesDurationFounded) return dateIsFree;
		return dateIsBusy;
	}


	public getFreeTimeSlotsForReceiveAndReturnCar(dt: Date): Date[] {


		const splitDate: Date[] = eachMinuteOfInterval({ start: dt, end: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1) }, { step: 15 });

		let fourHoursContinuesDurationFounded = false;
		let freeTimeSlotsForReceiveAndReturnCar: Date[] = [];
		const numberTimeSlotsInFourHours = 1 * 4; //seven hours


		let continuesDurationOfFreePeriods = 0;
		for (let j = 0; j < this.freePeriodsForCurrentBookingCarAfterFirstSelect.length; ++j) {

			let slicePeriods = this.freePeriodsForCurrentBookingCarAfterFirstSelect[j].car_periods.filter(//оставляем только периоды, которые заканчиваются после начала сравнимого дня
				(period) => isAfter(new Date(period.end), splitDate[0])
			);

			slicePeriods = slicePeriods.filter(//оставляем только те периоды, которые начинаются в течении сравнимого дня
				(period) => isBefore(new Date(period.begin), splitDate[splitDate.length - 1])
			);

			for (let i = 0; i < splitDate.length; ++i) {
				const date = splitDate[i];

				if (this.findFirstPeriodWhichConsistTimestamt(slicePeriods, date)) {

					freeTimeSlotsForReceiveAndReturnCar.push(date);
					continuesDurationOfFreePeriods += 1;

				}
				else if (continuesDurationOfFreePeriods < numberTimeSlotsInFourHours) {
					freeTimeSlotsForReceiveAndReturnCar = [];
					continuesDurationOfFreePeriods = 0;
				}
			}

			if (continuesDurationOfFreePeriods >= numberTimeSlotsInFourHours) fourHoursContinuesDurationFounded = true;
		}


		if (fourHoursContinuesDurationFounded) {
			const filledArrayOfFreeTimeSlots: Date[] = splitDate;

			for (let i = 0; i < filledArrayOfFreeTimeSlots.length; ++i) {

				const findItInFreeTimeSlotsArr: boolean = freeTimeSlotsForReceiveAndReturnCar.indexOf(filledArrayOfFreeTimeSlots[i]) >= 0 ? true : false;
				if (!findItInFreeTimeSlotsArr) filledArrayOfFreeTimeSlots[i] = shared.badDateEqualNull;
			}
			if (this.firstDateOfRange) {

				let findedPeriod: SinglePeriod[] = [];
				let lastEndOfLatestInterval: Date = shared.badDateEqualNull;
				for (let i = 0; i < this.freePeriodsForCurrentBookingCarAfterFirstSelect.length; ++i) {
					const periods = this.freePeriodsForCurrentBookingCarAfterFirstSelect[i].car_periods;
					const finded = isWithinIntervalsAndFindIt(periods, splitDateByMinutes(this.firstDateOfRange, 15));
					if (finded) findedPeriod.push(finded);
				}

				findedPeriod.forEach((period: SinglePeriod) => {
					if (isAfter(new Date(period.end), lastEndOfLatestInterval)) lastEndOfLatestInterval = new Date(period.end);
				});

				for (let i = 0; i < filledArrayOfFreeTimeSlots.length; ++i) {
					if (isAfter(filledArrayOfFreeTimeSlots[i], lastEndOfLatestInterval)) {

						filledArrayOfFreeTimeSlots[i] = shared.badDateEqualNull;
					}
				}

			}
			return filledArrayOfFreeTimeSlots;
		}
		return [];
	}


}
export const BookingState = () => (new State()).init();
