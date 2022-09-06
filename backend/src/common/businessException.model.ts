import ResponseModel, {StatusCode} from "./response.model";

export default  class BusinessException extends ResponseModel {
    constructor(message: string) {
        console.log("An Error occurred : ",message)
        super({}, StatusCode.ERROR, message);
    }
}