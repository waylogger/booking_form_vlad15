/**
* @module template.ts
*/

import * as shared from '../shared/sharedData';
import $ from 'jquery';






export const rootSection = (): any => {
	return `
<div id="${shared.domElementId.bookSelectDivId}" class="book__title tn-atom">Забронировать
	<span class="bool_title-price" id="carPrice"></span>
	<select id="${shared.domElementId.carSelectId}">
	</select>
</div>
<div id="${shared.domElementId.bookModuleId}" class="carNotSelect">
	<div id="${shared.domElementId.formInputId}">
		<div id="somes" style="background: #FAFAFB; padding: 15px">

			<div id="${shared.domElementId.dateListenerId}" class="book__dates ex-inputs">
				<div id="leftDateFrame" class="book__field-start book__field-wrap book__outline">
					<input id="${shared.domElementId.receiveDataId}"
						class="ex-inputs-start book__field-value" placeholder="DD.MM.YYYY"
						readonly />
					<div id="${shared.domElementId.receiveDateTextId}" class="book__field-subtitle">Дата получения</div>
				</div>
				<div id="receiveSelects" class="receiveSelects">
					<select id="${shared.domElementId.selectReceiveTimeId}" size="1"
						class="dateTimeSelect" disabled placeholder="--:--">
						<option>
							00:00
						</option>
					</select>
				</div>
				<div id="rightDateFrame" class="book__field-end book__field-wrap">
					<input id="${shared.domElementId.returnDataId}"
						class="ex-inputs-end book__field-value" placeholder="DD.MM.YYYY"
						readonly />
					<div id="${shared.domElementId.returnDateTextId}" class="book__field-subtitle">Дата возврата</div>
				</div>
				<div id="returnSelects" class="returnSelects">
					<select id="${shared.domElementId.selectReturnTimeId}" class="dateTimeSelect"
						disabled placeholder="--:--">
						<option>
							00:00
						</option>
					</select>
				</div>
				<div class="row">
					<div id="${shared.domElementId.inputPickerId}"class="ex-inputs-picker">
					<div id="${shared.domElementId.calendarCanvasId}"> </div>	
					</div>
				</div>
			</div>
			<div class="book__field-wrap">
				<select class="book__field book__field-receivePlaceSelect"
					id="${shared.domElementId.receivePlaceSelectId}">
				</select>
				<div class="book__field-subtitle">Место получения</div>
			</div>
			<div id="${shared.domElementId.receiveCustomPlaceId}"
				class="book__field-wrap customPlace-wrap-start">
				<input maxlength="200" type="text" id="${shared.domElementId.receiveCustomPlaceInputId}"
					class="book__field customPlace-hidden" placeholder="Введите адрес">
				<div class="book__field-subtitle" id="${shared.domElementId.receiveCustomTextId}">Куда подать авто?</div>
			</div>
			<div class="book__field-wrap">
				<select class="book__field book__field-receivePlaceSelect"
					id="${shared.domElementId.returnPlaceSelectId}">
				</select>
				<div class="book__field-subtitle">Место возврата</div>
			</div>
			<div id="${shared.domElementId.returnCustomPlaceId}"
				class="book__field-wrap customPlace-wrap-end">
				<input maxlength="200" type="text" id="${shared.domElementId.returnCustomPlaceInputId}"
					class="book__field customPlace-hidden" placeholder="Введите адрес">
				<div class="book__field-subtitle" id="${shared.domElementId.returnCustomTextId}">Укажите место возврата авто</div>
			</div>
			<div class="book__subtitle">Ваши данные</div>
			<form autocomplete="on">
				<div class="book__field-wrap">
					<input class="book__field" id="${shared.domElementId.custonersNameId}"
						name="name" maxlength="50" type="text" required
						placeholder="Введите имя" />
					<div id="${shared.domElementId.customersNameTextId}" class="book__field-subtitle">Имя и фамилия</div>
				</div>
				<div class="book__field-wrap">
					<input class="book__field" id="${shared.domElementId.customersPhoneId}"
						maxlength="14" name="phone" type="tel" required placeholder="+7" />
					<div id="${shared.domElementId.customersPhoneTextId}" class="book__field-subtitle">Телефон</div>
				</div>
			</form>
			<div id="lawAgreement">
				<input type="checkbox" class="book__checkbox" id="${shared.domElementId.ageAgree}"
					value="yes">
				<label id="${shared.domElementId.proofOfAgeId}" class="book__radio" for="age">Мне больше 23 лет и
					мой
					водительский
					стаж больше 3 лет</label><br>
				<input type="checkbox" class="book__checkbox" id="${shared.domElementId.policyAgree}"
					value="yes">
				<label id="${shared.domElementId.proofOfPolicyId}" class="book__radio" for="agree">Я согласен с Политикой
					обработки
					данных.</label>

			</div>
			<button class="book__btn" type="submit"
				id="${shared.domElementId.bookButtonId}">Забронировать</button>
			<div id="${shared.domElementId.bidTextId}" class="book__checkup">
				<span id="${shared.domElementId.carNameId}"></span>
				<span id="${shared.domElementId.periodRentId}"></span>
				<span id="${shared.domElementId.bidCostId}"></span>
				<span id="${shared.domElementId.deliveryCostId}"></span>
				<br>
				<span id="${shared.domElementId.costResolutionId}"></span>
			</div>
		</div>
	</div>
	<div id="console"></div>

</div>`
}

export function renderBookingForm(): void {
	$(`#${shared.domElementId.rootSectionId}`).html(rootSection());
}
