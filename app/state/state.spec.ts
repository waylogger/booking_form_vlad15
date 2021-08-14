

import { CarListResponse, SingleCar } from '../CORS/entities/apiExchange/serverTypes';
import { BookingState, State } from './state';


describe('Testing state initialization', () => {
	const phone = "+79155244228";
	const Name = "Qwerty qwerty";
	test('Состояние инициализированно и защищено от случайных изменений', async () => {

		const a: State = await BookingState();
		const places = (await BookingState()).getPlacesForReceiveAndReturnCars();

		places.result_code = 5;
		expect(a.getPlacesForReceiveAndReturnCars().result_code).not.toBe(5);
		a.saveCustomersPhone(phone);
		expect(a.getCustomersPhone()).toBe(phone);
		a.saveCustomersName(Name);
		expect(a.getCustomersName()).toBe(Name);

		const cars: CarListResponse = a.getAllCarsForRent();
		cars.result_code = 23;
		expect(a.getAllCarsForRent().result_code).not.toBe(23);
		a.selectCar('toyota_rav4');

		// const sCars = a.getSelectedCars();
		// sCars[0].model = 'qewrt';
		// expect(a.getSelectedCars()[0].model).not.toBe('qewrt');


	});
});