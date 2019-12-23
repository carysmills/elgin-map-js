import * as React from 'react';

function capitalize(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export default function MonthButtons({ selectedMonth, updateMonth }) {

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    const buttons = months.map((month) => {
        return (
            <button
                key={month}
                onClick={() => updateMonth(month)}
                id={month}
                aria-pressed={month === selectedMonth}
            >{capitalize(month)}
            </button>
        )
    })

    return <div className="spacer"><p className="calendarIntro">Or select a specific month</p>
        <div className={'gridContainer'}>{buttons}</div></div>;
}