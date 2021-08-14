

export interface SinglePlace {
    place_id: number,
    title: string,
    city_id: number,
    delivery_cost: number,
    archive: boolean,

}
// ------------------------------------------------------------------------------------------------
export interface PlacesResponse {
    result_code: number,
    places: SinglePlace[],
}
// ------------------------------------------------------------------------------------------------
export interface SingleCar{
    car_id: number,
    model: string,
    year: number,
}
export interface CarListResponse {
    result_code: number,
    cars: SingleCar[],
}
// ------------------------------------------------------------------------------------------------
export interface SinglePeriod{
    begin: string | Date,
    end: string | Date,
}
export interface FreePeriodResponse {
    result_code: number,
    car_periods: SinglePeriod[],
}
// ------------------------------------------------------------------------------------------------
export interface BidCostResponse {
    cost: number,
    prepay: number,
    deposit: number,
    error_message: string | null,
}
// ------------------------------------------------------------------------------------------------
export interface BidCreateResponse {
    bid_id: number,
    bid_number: number,
    error_message: string | null,
}
// ------------------------------------------------------------------------------------------------