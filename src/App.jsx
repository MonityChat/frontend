import Authentication from './Components/Authentication/Authentication';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FileNotFound from './Components/NotFound/FileNotFound';
import Home from './Components/Home/Home';
import './Css/Forms.css';
import './Css/Index.css';
import ForgotPassword from './Components/Authentication/ForgotPassword';
import Chat from './Components/Chat/Chat';

function App() {
	return (
		<BrowserRouter forceRefresh={true}>
			<div>
				<Switch>
					<Route
						path="/forgot-password"
						component={ForgotPassword}
						exact
					/>
					<Route path="/home" component={Home} exact />
					<Route
						path="/authentication"
						component={Authentication}
						exact
					/>
					<Route
						path="/"
						component={Chat}
						exact
					/>
					<Route component={FileNotFound} exact />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
