// Interfaces
export enum Status {
	SUCCESS = "success",
	ERROR = "error",
	CREATED = "Created",
	BAD_REQUEST = "bad request",
	NOT_AUTHORIZE = "not authorized",
	FORBIDDEN = "forbidden",
	NOT_FOUND = "not found",
}

export enum StatusCode {
	OK = 200,
	Created,
	ERROR = 500,
	BAD_REQUEST = 400,
	NOT_AUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
}

type ResponseHeader = { [header: string]: string | number | boolean };
interface IResponseBody {
	data: any;
	message: string;
	status?: string;
}

interface IResponse {
	statusCode: StatusCode;
	headers: ResponseHeader;
	body: string;
}

const STATUS_MESSAGES = {
	200: Status.SUCCESS,
	400: Status.BAD_REQUEST,
	500: Status.ERROR,
};

const RESPONSE_HEADERS: ResponseHeader = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*", // Required for CORS support to work
	"Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

/**
 * class ResponseModel
 */
export default class ResponseModel {
	private body: IResponseBody;
	private code: StatusCode;

	/**
	 * ResponseModel Constructor
	 * @param data
	 * @param code
	 * @param message
	 */
	constructor(data = {}, code = StatusCode.OK, message = "") {
		this.body = {
			data: data,
			message: message,
			status: STATUS_MESSAGES[code],
		};
		this.code = code;
	}

	/**
	 * Add or update a body variable
	 * @param variable
	 * @param value
	 */
	setBodyVariable = (variable: string, value: string): void => {
		this.body[variable] = value;
	};

	/**
	 * Set Data
	 * @param data
	 */
	setData = (data: any): void => {
		this.body.data = data;
	};

	/**
	 * Set Status Code
	 * @param code
	 */
	setCode = (code: StatusCode): void => {
		this.code = code;
	};

	/**
	 * Get Status Code
	 * @return {*}
	 */
	getCode = (): StatusCode => {
		return this.code;
	};

	/**
	 * Set message
	 * @param message
	 */
	setMessage = (message: string): void => {
		this.body.message = message;
	};

	/**
	 * Get Message
	 * @return {string|*}
	 */
	getMessage = (): any => {
		return this.body.message;
	};

	static ok(data: any, message: string = "Successful") {
		return new ResponseModel(data, StatusCode.OK, message).generate();
	}
	static created(data: any, message: string = "Created Successful") {
		return new ResponseModel(data, StatusCode.Created, message).generate();
	}
	static badRequest(data: any, message: string = "Request failed") {
		return new ResponseModel(data, StatusCode.BAD_REQUEST, message).generate();
	}
	static notFound(data: any, message: string = "Item not Found") {
		return new ResponseModel(data, StatusCode.NOT_FOUND, message).generate();
	}
	static error(data: any, message: string = "An internal error occured") {
		return new ResponseModel(data, StatusCode.ERROR, message).generate();
	}
	/**
	 * Geneate a response
	 * @return {IResponse}
	 */
	generate = (): IResponse => {
		return {
			statusCode: this.code,
			headers: RESPONSE_HEADERS,
			body: JSON.stringify(this.body),
		};
	};
}
