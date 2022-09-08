import * as AWS from 'aws-sdk';
import { APIGatewayEvent } from "aws-lambda";
import ResponseModel, {StatusCode} from '@common/response.model';
import {middyfy} from '@common/lambda';
import {getNewsletters} from "@repositories/newsletterRepository";

const getAllNewsletterHandler = async (event: APIGatewayEvent) => {
    try{
        const data = await getNewsletters();
        return  ResponseModel.ok(data, 'Fetched all Newsletters');
    }
    catch(e){
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
    
    
}

export const main = middyfy(getAllNewsletterHandler);