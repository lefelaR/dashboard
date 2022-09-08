import {ValidatedEventAPIGatewayProxyEvent} from '@common/apiGateway';
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {deleteNewsletter} from "@repositories/newsletterRepository";
import {APIGatewayEvent} from "aws-lambda";

const deleteNewsletterHandler = async (event: APIGatewayEvent) => {
    try{
        const  newsletterId  = event.pathParameters.id;
        const data = await deleteNewsletter(newsletterId);
        return  ResponseModel.ok(data,'Newsletter successfully deleted.');
    }
    catch(e){
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
}
export const main = middyfy(deleteNewsletterHandler);