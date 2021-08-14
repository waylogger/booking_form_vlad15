// ------------------------------------------------------------------------------------------------
export interface PeriodsRequest{
    car_id: number,
    begin: string,
    end: string,
    include_reserves: boolean,
    include_idles: boolean,
}
// ------------------------------------------------------------------------------------------------
export interface BidCostRequest{
    car_id: number,
    begin: string,
    end: string,
    begin_place_id: number,
    end_place_id: number,
    services: number[],
}
// ------------------------------------------------------------------------------------------------
export interface BidCreateRequest{
    fio: string,
    phone: string,
    car_id: number,
    begin: string,
    end: string,
    begin_place_id: number,
    end_place_id: number,
    file: File | string,
}
// ------------------------------------------------------------------------------------------------