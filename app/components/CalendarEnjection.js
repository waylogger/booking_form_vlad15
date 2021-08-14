/**
 * @module CalendarEnjector.js
 * @author Chris Davies <https://github.com/chrisdavies>
 * @remarks кое-что правил wlr986 <wayloggerman@gmail.com>
*/


// import { DateRangePicker } from './Calendar'
// import * as shared from '../shared/sharedData';
// import { bidPreview } from './bidPreview';


// import $ from 'jquery';

// export async function CalendarEnjector(myState) {

//     const root = document.querySelector('.ex-inputs');
//     const txtStart = root.querySelector('.ex-inputs-start');
//     const txtEnd = root.querySelector('.ex-inputs-end');
//     const container = root.querySelector('.ex-inputs-picker');
//     // Inject DateRangePicker into our container
//     DateRangePicker(container, null, myState).on('statechange', function (_, rp) { // Update the inputs when the state changes
//         var range = rp.state;
//         /**
//          * @author wlr986
//          * @description saving time data when change date
//         */


//         txtStart.value = range.start
//             ? range.start.toLocaleDateString()
//             : '';
//         if (txtStart.value)
//             txtEnd.value = range.end
//                 ? range.end.toLocaleDateString()
//                 : '';
//         else
//             txtEnd.value = '';
//         let leftDateInsert = false;
//         let rightDateInsert = false;
//         if (txtStart.value) {
//             $(`#${shared.domElementId.selectReceiveTimeId}`).attr('disabled', null);
//             $(`#${shared.domElementId.selectReceiveTimeId}`).trigger('change');
//             leftDateInsert = true;
//             // bidPreview(myState);
//         } else {
//             $(`#${shared.domElementId.selectReceiveTimeId}`).attr('disabled', true);

//             // bidPreview(myState);
//         }
//         if (txtEnd.value) {
//             $(`#${shared.domElementId.selectReturnTimeId}`).attr('disabled', null);
//             rightDateInsert = true;
//             // bidPreview(myState);
//             $(`#${shared.domElementId.returnPlaceSelectId}`).trigger('change');

//         } else {
//             $(`#${shared.domElementId.selectReturnTimeId}`).attr('disabled', true);
//             // bidPreview(myState);
//         }
//     });

//     // When the inputs gain focus, show the date range picker
//     txtStart.addEventListener('focus', showPicker); txtEnd.addEventListener('focus', showPicker);
//     function showPicker() {
//         container.classList.add('ex-inputs-picker-visible');
//     }
//     // If focus leaves the root element, it is not in the date picker or the inputs, so we should hide the date picker we do
//     // this in a setTimeout because redraws cause temporary loss of focus.
//     let previousTimeout;
//     function hidePicker(e) {

//         clearTimeout(previousTimeout);
//         const related = $(e.relatedTarget); 
//         if (related && related.hasClass('dp-day') || related.hasClass('dp-next') || related.hasClass('dp-clear')) return;

//         previousTimeout = setTimeout(function () {
//             if (!root.contains(document.activeElement)) {
//                 container.classList.remove('ex-inputs-picker-visible');
//             }
//         }, 10);

//     }
    
//     $(document).on('click',hidePicker);
//     $('.dr-cal-end').detach();
//     $('.dp-next').css('visibility', 'visible');

//     ;
// }
