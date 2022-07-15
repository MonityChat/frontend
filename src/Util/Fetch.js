import useAuthentication from './../Hooks/UseAuth';
import { toast } from 'react-toastify';

const [key] = useAuthentication();

/**
 * Available HTTP methods
 */
export const HTTP_METHOD = Object.freeze({
	POST: 'POST',
	GET: 'GET',
});

/**
 * Formats an query object to the right format so it can be appended to a url
 * @param {Object} query
 * @example {name: "jo", age: 10} => "?name=jo&age=10"
 * @returns {String} formatted String
 */
function formatQuery(query) {
	const keys = Object.keys(query);

	if (keys.length === 0) {
		return '';
	}

	const lastIndex = keys.length - 1;

	const formattedQuery = keys.reduce((fullQuery, currentKey, i) => {
		const string = `${currentKey}=${query[currentKey]}`;

		fullQuery += `${string}${i !== lastIndex ? '&' : ''}`;

		return fullQuery;
	}, '?');
	return formattedQuery;
}

export default class Fetch {
	static METHOD_POST = HTTP_METHOD.POST;
	static METHOD_GET = HTTP_METHOD.GET;
	static #key = key;

	#url;
	#query = {};
	#body = {};
	#headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	#method = HTTP_METHOD.GET;
	#withAuth = true;

	/**
	 * Constructor for a Fetch instance
	 * @param {String} url of the server
	 * @param {String} method of the request
	 * @param {Object} query of the request
	 * */
	constructor(url, method, query) {
		if (typeof url === 'string') {
			this.#url = url;
		}

		if (
			typeof method === 'string' &&
			Object.values(HTTP_METHOD).includes(method.toUpperCase())
		) {
			this.#method = method.toUpperCase();
		}

		if (typeof query === 'object') {
			this.#query = query;
		}
	}

	/**
	 * Create a new Fetch instance with the method of get
	 * @param {String} url of the server
	 * @param {Object} query of the request
	 * @returns new instance of the {@link Fetch} class
	 */
	static get(url, query) {
		return Fetch.new(url, Fetch.METHOD_GET, query);
	}

	/**
	 * Create a new Fetch instance with the method of post
	 * @param {String} url of the server
	 * @param {Object} query of the request
	 * @returns new instance of the {@link Fetch} class
	 */
	static post(url, query) {
		return Fetch.new(url, Fetch.METHOD_POST, query);
	}

	/**
	 * Create a new Fetch instance
	 * @param {String} url of the server
	 * @param {HTTP_METHOD} method of the request
	 * @param {Object} query of the request
	 * @returns new instance of the {@link Fetch} class
	 */
	static new(url, method, query) {
		return new Fetch(url, method, query);
	}

	/**
	 * Sets the url of the server where the request goes to
	 * @param {String} url of the server
	 * @returns {this} itself for chaining
	 */
	url(url) {
		if (typeof url === 'string') {
			this.#url = url;
		}
		return this;
	}

	/**
	 * Adds queryparameters to the request in the url
	 * @param {Object} query of the request
	 * @param {overrideOld} overrideOld should the new stuff override the old one or spreaded out
	 * @default overrideOld = true
	 * @returns {this} itself for chaining
	 */
	query(query, overrideOld = true) {
		if (typeof query === 'object') {
			if (overrideOld) {
				this.#query = query;
			} else {
				this.#query = { ...this.#query, ...query };
			}
		}

		return this;
	}

	/**
	 * Sets the method of the request
	 * @param {HTTP_METHOD} method of the request
	 * @returns {this} itself for chaining
	 */
	method(method) {
		if (
			typeof method === 'string' &&
			Object.values(HTTP_METHOD).includes(method.toUpperCase())
		) {
			this.#method = method;
		}
		return this;
	}

	/**
	 * Adds a auth key to the request
	 * @param {String} key for authentication on the server
	 * @returns {this} itself for chaining
	 */
	authKey(key) {
		if (typeof key === 'string') {
			Fetch.#key = key;
		}
		return this;
	}

	/**
	 * Adds a auth key to the request
	 * @static
	 * @param {String} key for authentication on the server
	 * @returns {this} itself for chaining
	 */
	static authKey(key) {
		if (typeof key === 'string') {
			Fetch.#key = key;
		}
		return this;
	}

	/**
	 * Toggles if the auth key should automaticly be added to the request.
	 * @param {Boolean} withAuth should auth be automaticly added
	 * @default withAuth = true
	 * @returns {this} itself for chaining
	 */
	withAuth(withAuth = true) {
		this.#withAuth = Boolean(withAuth);
		return this;
	}

	/**
	 * Adds headers to the request
	 * @param {Object} headers of a request
	 * @param {Boolean} overrideOld should the new stuff override the old one or spreaded out
	 * @default withAuth = true
	 * @returns {this} itself for chaining
	 */
	headers(headers, overrideOld = true) {
		if (typeof headers === 'object') {
			if (overrideOld) {
				this.#headers = headers;
			} else {
				this.#headers = { ...this.#headers, ...headers };
			}
		}
		return this;
	}

	/**
	 * Adds body data to the request
	 * @param {Object} body of a request
	 * @param {Boolean} overrideOld should the new stuff override the old one or spreaded out {@default = true}
	 * @returns {this} itself for chaining
	 */
	body(body, overrideOld = true) {
		if (typeof body === 'object') {
			if (overrideOld) {
				this.#body = body;
			} else {
				this.#body = { ...this.#body, ...body };
			}
		}
		return this;
	}

	/**
	 * Creates the acutal request with @see {@link fetch} API and adds all the given data to it
	 * @returns {Promise}
	 */
	#request() {
		if (!this.#url) {
			return this;
		}

		const formattedQuery = formatQuery(this.#query);

		const fullUrl = this.#url + formattedQuery;

		const options = {
			method: this.#method,
			headers: {
				...(this.#withAuth && { authorization: Fetch.#key }),
				...this.#headers,
			},
			...(this.#method !== HTTP_METHOD.GET && {
				body: JSON.stringify(this.#body),
			}),
		};

		return fetch(fullUrl, options);
	}

	/**
	 * Send the request. Use async/await or .then to get the result
	 * @returns {Promise} promise of the request
	 */
	send() {
		return this.#request();
	}

	/**
	 *
	 * @param {String} pending String which should be displayed while the promise pending
	 * @param {String} success String which should be displayed if the promise succeded
	 * @param {String} error String which should be displayed if the promise fails
	 * @param {Boolean} toJSON should the result be automaticly converted to JSON {@default false}
	 * @returns {Object} JSON object of the result or HTTP result
	 */
	async sendAndToast(pending, success, error, toJSON = false) {
		const res = await toast.promise(this.send(), {
			pending,
			success,
			error,
		});
		if (toJSON) {
			const json = await res.json();
			return json;
		} else {
			return res;
		}
	}

	/**
	 * Send the request and convert it to JSON
	 * @async
	 * @returns {Promise<Object>} result in JSON format
	 */
	async sendGetJSON() {
		const result = await this.send();
		const json = await result.json();
		return json;
	}
}