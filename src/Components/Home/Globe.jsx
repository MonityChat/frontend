import React from 'react';
import { Canvas } from 'react-three-fiber';

export default function Globe() {
	return (
		<Canvas >
			<Box position={[1, 1, 1]}/>
		</Canvas>
	);
}

function Box() {
	return (
		<mesh>
			<boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
			<meshStandardMaterial attach="material" color="green" />
		</mesh>
	);
}
