import { State } from "../../../state/state";
import * as shared from '../../../shared/sharedData';



export async function canvasRenderer(state: State): Promise<string> {


        const monthNamespace: string[] = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];


        const header = `
					<div class="dp-cal"> 
					<header class="dp-cal-header"> 
						<button tabindex="-1" type="button" id="${shared.domElementId.dpPrevMonth}" class="dp-prev">Prev</button>
                                                <div tabindex="-1" type="button" class="dp-cal-month" id="dp-cal-month-text">
					${monthNamespace[state.getSelectedMonthInx()]}</div>
                                        	<div tabindex="-1" type="button" class="dp-cal-year">
                                                ${state.getSelectedYear()}
                                                </div>
						<button tabindex="-1" type="button" id="${shared.domElementId.dpNextMonth}" class="dp-next">Next</button>
						</header>
                                          
						<div id="${shared.domElementId.calendarGridId}" class="dp-days">

				</div>
					`

        const footer = `
				<footer class="dp-cal-footer">
				<button tabindex="-1" type="button" class="dp-clear">Очистить</button>
				<button onClick="
				document.querySelector('.ex-inputs-picker').classList.remove('ex-inputs-picker-visible');" tabindex="-1" type="button" class="dp-close" id="dp-close-btn">Закрыть</button>
				</footer>
				</div>`


        return header + footer;
}

