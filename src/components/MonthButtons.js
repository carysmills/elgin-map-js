import * as React from 'react';

function capitalize(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export default function MonthButtons({ selectedMonth, updateMonth }) {

    const months = ["jan", "feb", "march"];

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

    return buttons;
}