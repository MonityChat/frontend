import React from 'react';
import './Css/DayDivider.css';

export default function DayDivider({ date }) {
	return (
		<div className="day-divider">
			<div className="gradient-bar left"></div>
			<span className="date">{formatDate(date)}</span>
			<div className="gradient-bar right"></div>
		</div>
	);
}

function formatDate(time) {
	const date = new Date(time);

    const now = new Date();
    if(date.getDate() === now.getDate()){
        return 'Today';
    }

    const yesterday = new Date(Date.now() - 86400000);
    if(date.getDate() === yesterday.getDate()){
        return 'Yesterday';
    }

    const weekbefore = new Date(Date.now() - (1000 * 60 * 60 * 24 * 7));
    if(date.getTime() >= weekbefore.getTime() && date.getTime() <= now.getTime()){
        switch (date.getDay()) {
            case 0:
                return 'Last Sunday';
            case 1:
                return 'Last Monday';
            case 2:
                return 'Last Tuesday';
            case 3:
                return 'Last Wednesday';
            case 4:
                return 'Last Thursday';
            case 5:
                return 'Last Friday';
            case 6:
                return 'Last Saturday';
            default:
                return 'Last Sunday';
        }
    }

	return date.toLocaleDateString();
}
