/**
 * @module Calendar.js
 * @author Chris Davies <https://github.com/chrisdavies>
 * @remarks кое-что правил wlr986 <wayloggerman@gmail.com>
*/

// import { firstDateIsSelect, secondDateIsSelect, firstDate, secondDate, isDateShouldBeDisabled, datePreview, hideCal, setFirstDate, dropFirstDate, setSecondDate, dropSecondDate } from './handlers'
// import { dataFromServer } from './state/dataFromServer'
import $ from 'jquery'
import { bidPreview } from './bidPreview';
import * as shared from '../shared/sharedData'
let dateRangePicker = 0;
let myState;

	var s = {
		today: "Сегодня",
		clear: "Очистить",
		close: "Закрыть"
	};

	var b = {
		day: {
			onKeyDown: function (t, e) {
				var n = t.keyCode,
					a = n === m.left ? -1 : n === m.right ? 1 : n === m.up ? -7 : n === m.down ? 7 : 0;
				n === m.esc ? e.close() : a && (t.preventDefault(), e.setState({
					hilightedDate: (o = e.state.hilightedDate, r = a, (o = new Date(o)).setDate(o.getDate() + r), o)
				}));
				var o, r
			},
			onClick: {
				"dp-day": function (t, e) {
					t.stopPropagation();
					var dt = new Date(parseInt(t.target.getAttribute("data-date")));

					if (myState.isFirstDateOfRangeWasSelect()) {
						var days = $(`.dp-day`).toArray();
						days = days.filter(
							(item) => $(item).hasClass('dr-in-range')
						);
						var bad = '';
						days.forEach(
							(item) => {
								const d = $(item).hasClass('dp-day-disabled');
								if (d) bad = true;
							}
						);
						if (bad) return;
					};
					e.setState({
						selectedDate: dt,
					})
					/**
					 * @author wlr986
					*/
					if (myState.isFirstDateOfRangeWasSelect() && myState.isSecondDateOfRangeWasSelect()) {
						myState.dropFirstDateOfRange();
						myState.dropSecondDateOfRange();
					}
					if (myState.isFirstDateOfRangeWasSelect()) {

						$('#dp-close-btn').html('Сохранить');
						myState.setSecondDateOfRange(dt);
						return;
					}
					myState.setFirstDateOfRange(dt);

					if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
						e.stopPropagation();
					}
				},
				"dp-next": function (t, e) {
					var n = e.state.hilightedDate;
					e.setState({
						hilightedDate: v(n, 1)
					})
					t.stopPropagation();

				},
				"dp-prev": function (t, e) {
					var n = e.state.hilightedDate;
					e.setState({
						hilightedDate: v(n, -1)
					})

					t.stopPropagation();
				},
				"dp-today": function (t, e) {
					e.setState({
						selectedDate: o()
					})
				},
				"dp-clear": function (t, e) {
					myState.dropFirstDateOfRange();
					myState.dropSecondDateOfRange();

					bidPreview(myState);
					// dataFromServer.clickedCars = [];
					e.setState({
						selectedDate: null
					})
					t.stopPropagation();
				},
				"dp-close": function (t, e) {
					e.close()
				},
				"dp-cal-month": function (t, e) {
					e.setState({
						view: "month"
					})

					t.stopPropagation();
				},
				"dp-cal-year": function (t, e) {
					e.setState({
						view: "year"
					})

					t.stopPropagation();
				}
			},
			render: function (r) {
				console.log(321);
				var i = r.opts,
					t = i.lang,
					e = r.state,
					n = t.days,
					a = i.dayOffset || 1,
					s = e.selectedDate,
					u = e.hilightedDate,
					d = u.getMonth(),
					c = o().getTime();



				const weekStr = `
				${n.map(function (t, e) {
					return `<span class="dp-col-header"> ${n[(e + a) % n.length]} </span>`
				}).join("")}
					`
				const header = `
					<div class="dp-cal"> 
					<header class="dp-cal-header"> 
						<button tabindex="-1" type="button" class="dp-prev">Prev</button> 
						<button tabindex="-1" type="button" class="dp-cal-month" id="dp-cal-month-text">
					${t.months[d]} </button>
						<button tabindex="-1" type="button" class="dp-cal-year">
					 ${u.getFullYear()} 
					</button>
						<button tabindex="-1" type="button" class="dp-next">Next</button>
						</header>
						<div class="dp-days">
					`


				const select = '';
				const closeOrSaveName = myState.isFirstDateOfRangeWasSelect() && myState.isSecondDateOfRangeWasSelect() ? "Сохранить" : "Закрыть";
				const footer = `
				</div>
				<footer class="dp-cal-footer">
				
				<button tabindex="-1" type="button" class="dp-clear">  ${t.clear} </button>
				</script>
				<button onClick="
				document.querySelector('.ex-inputs-picker').classList.remove('ex-inputs-picker-visible');" tabindex="-1" type="button" class="dp-close" id="dp-close-btn">${closeOrSaveName}</button>

				</footer>
				</div>`

				function resHTML(timestamp, e, n) {
					var res = "";
					var newDate = new Date(timestamp);
					newDate.setDate(1);
					newDate.setDate(1 - newDate.getDay() + e);
					e && newDate.getDate() === e + 1 && newDate.setDate(e - 6);
					for (var r = 0; r < 42; ++r) {
						const r = n(newDate);
						res += r;
						newDate.setDate(newDate.getDate() + 1);
					}
					return res;
				}
				/**
				 * @function
				 * @param {Date}
				 * @returns {HTMLButtonElement}
				 * @description смысл функции в том, что она принимает timestamp и возвращает разметку HTML кнопки с необходимыми стилями: пограничный день(pg-edge-day), текущий день (dp-day-today),
				 * неактивный день (dp-day-disabled), а также текущий и выбранный день (dp-current, dp-select)
				*/
				function dayHTML(t) {
					var currentMonth = d;
					// e === true if currenthMonth не равен t.Month(). Смысл переменной в том, что она используется для установления класса пограничного дня
					var onBorder = t.getMonth() !== currentMonth;//Boolean
					// var n = !i.inRange(t);//Boolean 
					var shouldToDisabled = myState.isDateBusy(t);
					var attr = shouldToDisabled ? 'disabled' : '';
					// Если а установлено, то дата помечается как сегодняшнее число
					var isToday = shouldToDisabled ? false : t.getTime() === c;//Boolean
					//итоговая разметка кнопки
					var res = "dp-day";//String

					var isCurrent = false; //shouldToDisabled ? false : (t.getTime() === c) && (d === new Date().getMonth() + 1)
					var isSelected = false; //shouldToDisabled ? false : h(t, s);

					res += onBorder ? " dp-edge-day" : "";
					res += isCurrent ? " dp-current" : "";
					res += isSelected ? " dp-selected" : "";
					res += shouldToDisabled ? " dp-day-disabled" : "";
					res += isToday ? " dp-day-today" : "";


					return `
					<button ${attr} tabindex=\"-1\" type=\"button\" class=\"${(res += " " + i.dateClass(t, r))}\" data-date=\" ${t.getTime()} \" id=\"day-${t.getDate()} \"> ${t.getDate()} </button>
					`;

				}
				const body = resHTML(u, a, dayHTML);



				return header + select + weekStr + body + footer;
			}
		},
		year: {
			render: function (t) {
				var e = t.state,
					n = e.hilightedDate.getFullYear(),
					a = e.selectedDate.getFullYear();

				return '<div class="dp-years">' + function (t, e) {
					for (var n = "", a = t.opts.max.getFullYear(); a >= t.opts.min.getFullYear(); --a) n += e(a);
					return n
				}(t, function (t) {
					var e = "dp-year";
					return e += t === n ? " dp-current" : "", '<button tabindex="-1" type="button" class="' + (e += t === a ? " dp-selected" : "") + '" data-year="' + t + '">' + t + "</button>"
				}) + "</div>"
			},
			onKeyDown: function (t, e) {
				var n = t.keyCode,
					a = e.opts,
					o = n === m.left || n === m.up ? 1 : n === m.right || n === m.down ? -1 : 0;
				if (n === m.esc) e.setState({
					view: "day"
				});
				else if (o) {
					t.preventDefault();
					var r = i(e.state.hilightedDate, o);
					e.setState({
						hilightedDate: l(r, a.min, a.max)
					})
				}
			},
			onClick: {

				"dp-year": function (t, e) {
					e.setState({
						hilightedDate: (n = e.state.hilightedDate, a = parseInt(t.target.getAttribute("data-year")), (n = new Date(n)).setFullYear(a), n),
						view: "day"
					});
					var n, a

					t.stopPropagation();
				}
			}
		},
		month: {
			onKeyDown: function (t, e) {
				var n = t.keyCode,
					a = n === m.left ? -1 : n === m.right ? 1 : n === m.up ? -3 : n === m.down ? 3 : 0;
				n === m.esc ? e.setState({
					view: "day"
				}) : a && (t.preventDefault(), e.setState({
					hilightedDate: v(e.state.hilightedDate, a, !0)
				}))
			},
			onClick: {
				"dp-month": function (t, e) {
					e.setState({
						hilightedDate: (n = e.state.hilightedDate, a = parseInt(t.target.getAttribute("data-month")), v(n, a - n.getMonth())),
						view: "day"
					});
					var n, a
					t.stopPropagation();
				}
			},
			render: function (t) {
				var e = t.opts.lang.months,
					a = t.state.hilightedDate.getMonth();
				return '<div class="dp-months">' + e.map(function (t, e) {
					var n = "dp-month";
					return '<button tabindex="-1" type="button" class="' + (n += a === e ? " dp-current" : "") + '" data-month="' + e + '">' + t + "</button>"
				}).join("") + "</div>"
			}
		}
	};
export const DateRangePicker = dateRangePicker;

