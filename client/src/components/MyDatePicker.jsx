import { DatePicker } from "rsuite";

export const MyDatePicker = ({selectedDate,setSelectedDate}) => {


    
    return(<>
        <DatePicker format="dd.MM.yyyy HH:mm" size="lg"
            isoWeek shouldDisableDate={(date) => (date.getDay() === 0 || date.getDay() === 6)}
            hideHours={(hour) => (hour < 8 || hour > 20)} limitStartYear={5} limitEndYear={5} hideMinutes={(min) => min !== 0}
            value={selectedDate} onChange={(date) => setSelectedDate(date)}
            
            // shouldDisableHour={(hour) => hour === data.hour }
        />
    </>);
};