import { bundleBookingForm } from './app/bundle';
import { CarsState} from './app/state/CarsState'


(
	async (): Promise<void> => {
		await bundleBookingForm();
	}
)();


