import React from 'react';
import { Link } from 'react-router-dom';
import useQuery from './../../Hooks/useQuery';
import './Css/NewAccount.css';
import ERROR from './../../Util/Errors';

/**
 * Component to display the a short information after
 * pressing on the link on the registraition email
 */
export default function NewAccount() {
	const query = useQuery();

	return (
		<div className="inset-container new-account">
			{query.get('error') !== ERROR.NONE ? (
				<>
					<h1 className="heading">Sorry :(</h1>
					<p>An error occured during the registration process</p>
					<Link to="/login">
						<button>Back to Login</button>
					</Link>
				</>
			) : (
				<>
					<h1 className="heading">Success</h1>
					<p>Your Monity account was created, login to chat now!</p>
					<Link to="/login">
						<button>Back to Login</button>
					</Link>
				</>
			)}
		</div>
	);
}
