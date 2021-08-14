
import {SingleCar, SinglePeriod} from '../CORS/entities/apiExchange/serverTypes'
export interface SingleCarWithPeriods extends SingleCar {
	car_periods: SinglePeriod[],
}