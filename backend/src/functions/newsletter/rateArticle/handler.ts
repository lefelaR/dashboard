import { ValidatedEventAPIGatewayProxyEvent } from '@common/apiGateway';
import ResponseModel from '@common/response.model';
import schema from './schema';
import { middyfy } from '@common/lambda';
import { getArticle, rateArticle } from "@repositories/newsletterRepository";
import errorResponse from '@common/errorResponse';


const rateNewsletterHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const { body } = event;

        let slug = body.slug;
        
        const article = await getArticle(slug);
        
        let newRaters:any[] = []; 

        if(article.Items[0].raters)
        {
            newRaters = article.Items[0].raters;
        }
        else
        {
            newRaters = [];
        }
        newRaters.push({userId: body.userId, rating: body.rating});
        
        let newRating = 0;
        for (let i=0; i<newRaters.length; i++) {
            if (newRaters[i].rating != -1) {
                newRating = newRating + parseFloat(newRaters[i].rating);
            }
        }
        //@ts-ignore
        newRating = parseFloat(newRating/newRaters.length);

        const data = rateArticle(article.Items[0].newsletterId,newRaters, newRating );
        return ResponseModel.ok(data, 'Rating successfully submitted');
    }
    catch (e) {
        return errorResponse(e);
    }
}
export const main = middyfy(rateNewsletterHandler);