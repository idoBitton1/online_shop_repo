import React from "react"
import { DisplayRecord } from "./DisplayRecord"
import "./MainContent.css"

//Material Ui

export const MainContent = () => {

    return(
        <>
        <div className="main_content_container">           
            <div>
                <div className="subtitles">
                    <h2>
                        date
                    </h2>
                    <h2>
                        from
                    </h2>
                    <h2>
                        to
                    </h2>
                    <h2>
                        hours
                    </h2>
                    <h2>
                        total
                    </h2>
                </div>

                <DisplayRecord 
                  date="2022-08-22"
                  start_time="22:00"
                  end_time="23:01"
                />
            </div>
            </div>
        </>
    )
}