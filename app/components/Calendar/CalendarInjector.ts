/**
 * @module CalendarInjector
 * @description
 *  Архитектура Модуля:
 * 			Injector - предназначен для соединения календаря и состояния приложения
 * 			Renderer - предназначен для генерации разметки календаря
 * 			CanvasRenderer - предназначен для генерации разметки контейнера календаря
 * 			GridRenderer - предназначен для генерации разметки дневной сетки
 * 				
*/
import { State } from "../../state/state";
import { calendarRenderer } from './rendering/CalendarRenderer'

export async function CalendarInjector(state: State): Promise<void> {
    if (!(await calendarRenderer(state))) throw new Error('Failure Calendar Injecting');
}