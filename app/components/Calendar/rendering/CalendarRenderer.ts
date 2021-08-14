/**
 * @module CalendarRenderer
 * @description  принимает разметку от canvasRenderer и gridRenderer и последовательно через jQuery производит их отрисовку
 * */



import { State } from "../../../state/state";
import $ from 'jquery';
import * as shared from '../../../shared/sharedData';


import { canvasRenderer } from "./CanvasRenderer";
import { gridRenderer } from "./GridRenderer";
export async function calendarRenderer(state: State): Promise<boolean> {
    const renderIsSuccess = true;
    const renderIsFailure = false;

    //render part
    const rendererPromises: Promise<string>[] = [];
    rendererPromises.push(canvasRenderer(state));
    rendererPromises.push(gridRenderer(state));

    const stringsForRender: string[] = await Promise.all(rendererPromises);


    $(`#${shared.domElementId.calendarCanvasId}`).html(stringsForRender[0]);
    $(`#${shared.domElementId.calendarGridId}`).html(stringsForRender[1]);
    // ---------------------------------------------
    $(`#${shared.domElementId.dpNextMonth}`).on(
        'click', async (e) => {
            state.incSelectedMonthInx();
            await calendarRenderer(state);
        }
    );
    $(`#${shared.domElementId.dpPrevMonth}`).on(
        'click', async (e) => {
            state.decSelectedMonthInx();
            await calendarRenderer(state);
        }
    );

    $('.dp-clear').on('click', async (e) => {
        state.dropDateState();
        e.stopPropagation();

        await calendarRenderer(state);
    }
    )
    $('.dp-next').on('click', (e) => { e.stopPropagation(); })
    $('.dp-prev').on('click', (e) => { e.stopPropagation(); })
    $('.dp-day').on('click', async (e) => {
        const dateDataOfDay = $(e.target).attr('data-date');
        const elemID = $(e.target).attr(
            'id'
        );
        if (dateDataOfDay) {
            const valueOfDate = parseInt(dateDataOfDay, 10);
            const timestamp = new Date(valueOfDate);
            if (!state.isFirstDateOfRangeWasSelect()) {
                state.setFirstDateOfRange(timestamp);
                if (elemID)
                    state.setFirstSelectedId(elemID);
            }
            else if (state.isFirstDateOfRangeWasSelect() && !state.isSecondDateOfRangeWasSelect()) {
                state.setSecondDateOfRange(timestamp);
                if (elemID)
                    state.setSecondSelectedId(elemID);
            }
            else if (state.isFirstDateOfRangeWasSelect() && state.isSecondDateOfRangeWasSelect()) {
                state.dropDateState();
            }
            await calendarRenderer(state);
        }


        e.stopPropagation();
    })
    $('.dp-days').on('click', (e) => { e.stopPropagation(); })
    $('.dp-cal-header').on('click', (e) => { e.stopPropagation(); })
    $('.dp-cal-footer').on('click', (e) => { e.stopPropagation(); })
    return renderIsSuccess;
}