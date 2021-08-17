import {Action, createStore, Reducer, Store, StoreCreator} from 'redux'
import {PayloadAction} from '@reduxjs/toolkit'

const INC: string = "INC";
const INC_ON: string = "INC_ON";
const increment = (): Action => {
	return {
		type: INC
	}
}

const incrementOn = (on: number): PayloadAction<number> => {
	return {
		type: INC_ON,
		payload: on,
	}
}

const reduser: Reducer<number | undefined,PayloadAction<number>> = (state: number | undefined, action: PayloadAction<number>) => {
	if (action.type === INC) {
		if (state)
		return state + 1;
	}
	else if (action.type === INC_ON ){
		if (state)
			return state + action.payload;
	}
	return state;
}
const defState: number = 0;
const store: Store = createStore(reduser,defState);
console.log(store.getState());


