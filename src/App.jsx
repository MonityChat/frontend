import Authentication from './Components/Authentication/Authentication';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FileNotFound from './Components/NotFound/FileNotFound';
import Home from './Components/Home/Home';
import Test from './Test';
import './Css/Forms.css';
import './Css/Index.css';

function App() {
	return (
		<BrowserRouter forceRefresh={true}>
			<div>
				<Switch>
					<Route path="/forgot-password" component={Test} exact />
					<Route path="/home" component={Home} exact />
					<Route
						path="/authentication"
						component={Authentication}
						exact
					/>
					<Route component={FileNotFound} exact />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
