"use client"; // This is a client component 👈🏽
import React, { useState, useEffect } from "react";

export default function CountDown(){
    
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light')


        const interval = setInterval(() => {
            let startDate = new Date('June 25, 2024 16:37:52');
            let currentDate = new Date();
            const diff = startDate.getTime() - currentDate.getTime();

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setTime({ hours, minutes, seconds, days });
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    return(
        <div id="countdown">
            <ul className="count-down list-none inline-block text-white text-center mt-8 m-6">
                <li id="days" className="count-number inline-block m-2">{time.days}
                    <p className="count-head">Days</p>
                </li>
                <li id="hours" className="count-number inline-block m-2"> {time.hours}
                    <p className="count-head">Hours</p>
                </li>
                <li id="mins" className="count-number inline-block m-2">{time.minutes}
                    <p className="count-head">Mins</p>
                </li>
                <li id="secs" className="count-number inline-block m-2">{time.seconds}
                    <p className="count-head">Secs</p>
                </li>
                <li id="end" className="h1"></li>
            </ul>
        </div>
    )
}