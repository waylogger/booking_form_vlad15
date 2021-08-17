import { CarListResponse, SingleCar } from "../../CORS/entities/apiExchange/serverTypes";

export interface CarState {
	/**
	 * @remarks все машины, данные о которых получены от сервера
	*/
	allCarsForRent: CarListResponse,
	/**
	 * @remarks все машины с одинаковым наименованием
	*/
	allCarsForCurrentBooking: SingleCar[],
	/**
	 * @remarks имя модели, которое было выбрано из селекта в форме брони
	*/
	selectedCarModelName: string,
	/**
	 * @remarks id авто, которая пойдет в заявку на бронирование
	*/
	mainCarForBid: number,
};