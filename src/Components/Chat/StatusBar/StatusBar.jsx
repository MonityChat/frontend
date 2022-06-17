import React, { useEffect, useRef, useState } from 'react';
import ContactStatus from './ContactStatus';
import GroupStatus from './GroupStatus';
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
			<div className="content">
				{/* <ContactStatus
					profileImage={'/src/image/Donut.png'}
					userName={'Mike von den'}
					uuid={'1213-12424-214124-24wf2'}
					status={'away'}
					shortStatus={'Away from my Keyboard'}
					description={`A paragraph  [Link text Here](https://google.com)
					#H1* Follows [CommonMark](https://commonmark.org)
					 with *emphasis* and **strong importance**. 
					 ![alt text](https://www.w3schools.com/howto/img_paris.jpg)
					 ![alt text](https://www.w3schools.com/howto/img_paris.jpg)
					 ![alt text](https://www.w3schools.com/howto/img_paris.jpg)
					 ![alt text](https://www.w3schools.com/howto/img_paris.jpg)`}
				/> */}
				<GroupStatus
					groupName={'Best group from SW'}
					profileImage={'/src/image/Donut.png'}
					uuid={'1213-12424-214124-24wf2'}
					shortStatus={'Away from my Keyboard'}
				/>
			</div>
		</div>
	);
}
