 import React, {useState, useEffect} from 'react'
 // import { DateRange } from 'react-date-range';
// import 'react-date-range/dist/styles.css'; // import the styles
// import 'react-date-range/dist/theme/default.css'; // import the theme 
import DatePicker, { DateObject, getAllDatesInRange } from "react-multi-date-picker" 
import "react-datepicker/dist/react-datepicker.css";

import { Calendar } from 'react-multi-date-picker';

 


 const CalendarRange = () => { 
    const [dates, setDates] = useState([])
    const [allDates, setAllDates] = useState([])

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dateArr = [];
     
    allDates?.map((index) => (
        dateArr.push(index.format('YYYY/MM/DD'))
    )) 

console.log(dateArr)
  
   return (
     <div style={{marginTop: '50px'}}>
        <h1>CalendarRange</h1>


        <div>
            <Calendar
                rangeHover={true}
                range
                weekDays={weekDays}
                months={months}
                onChange={dateObjects => {
                setDates(dateObjects)
                setAllDates(getAllDatesInRange(dateObjects))
                }} 
            />
            {/* <DatePicker 
                className='dataPPPicker' 
                rangeHover={true}
                range
                calendarPosition="bottom-right"
                fixMainPosition
                value={dates} 
                weekDays={weekDays}
                months={months}
                onChange={dateObjects => {
                setDates(dateObjects)
                setAllDates(getAllDatesInRange(dateObjects))
                }} 
            />  */}
            {dates.length > 1 &&
                <div>
                    <h5>
                        All Dates between {dates[0].format()} and {dates[1].format()}:
                    </h5>
                    <ul>
                        {
                            allDates?.map((date, index) =>   
                                    <li key={index}>
                                        {date.format('YYYY/MM/DD')}  
                                    </li>  
                                ) 
                        }
                    </ul>
                </div>
            }
        </div> 

     </div>
   )
 }
 
 export default CalendarRange