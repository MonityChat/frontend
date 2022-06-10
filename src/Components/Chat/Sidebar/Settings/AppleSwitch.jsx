import React from 'react';
import './Css/AppleSwitch.css';

export default function AppleSwitch({label, checked, value, name, onClick}) {
	return (
		<label class="form-switch">
			<input type="checkbox" defaultChecked={checked} onClick={onClick}/>
			<i></i>
			{label}
		</label>
	);
}
