import React, { useEffect, useRef, useState } from 'react';
import './Css/StatusBar.css';

export default function StatusBar() {
	const [opened, setOpened] = useState(false);

	const statusBarRef = useRef();

	useEffect(() => {
		statusBarRef.current.classList.toggle('opened', opened);
	}, [opened]);

	return (
		<div className="statusbar" ref={statusBarRef}>
			<div
				className="line"
				onClick={() => setOpened((prev) => !prev)}
			></div>
		</div>
	);
}
