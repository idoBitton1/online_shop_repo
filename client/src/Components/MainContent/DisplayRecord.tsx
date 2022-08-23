import React from "react"
import "./DisplayRecord.css"

//Material Ui

interface MyProps{

    date: string,
    start_time: string,
    end_time: string
}

export const DisplayRecord: React.FC<MyProps> = ({date, start_time, end_time}) => {

    const getHours = (start_date: string, start_time: string, end_time: string): number => {

        //set the dates variables
        const start: Date = new Date(`${start_date} ${start_time}`)
        var end: Date = new Date(`${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} ${end_time}`);
        
        //if a day passed
        if(Number(end_time.split(":")[0]) < Number(start_time.split(":")[0]))
          end.setDate(end.getDate() + 1) // update the date
    
        //the diff between the dates in milliseconds
        const diff: number = end.getTime() - start.getTime();
    
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
    
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
    
        const res: number = hh + mm/60

        return Number(res.toFixed(2));
    }

    const hours: number = getHours(date, start_time, end_time);
    const total = hours * 30; //salary_per_hour

    return(
        <div className="record">
            <h3>
                {date}
            </h3>
            <h3>
                {start_time}
            </h3>
            <h3>
                {end_time}
            </h3>
            <h3>
                {hours}
            </h3>
            <h3>
                {total}
            </h3>
        </div>
    )
}