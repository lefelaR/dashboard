import { ValidatedEventAPIGatewayProxyEvent } from '@common/apiGateway';
import ResponseModel, { StatusCode } from '@common/response.model';
import schema from './schema';
import { middyfy } from '@common/lambda';
import { postNewsletter } from "@repositories/newsletterRepository";
import Newsletter from "@models/newsletter.model";


const postNewsletterHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const { body } = event;
        const newsletter = new Newsletter();
        let slug = body.title.toLowerCase().split(' ').join('-');
        newsletter.datePublished = new Date().getTime();
        newsletter.title = body.title;
        newsletter.slug = slug;
        newsletter.html = body.html;
        newsletter.status = body.status;
        newsletter.author = body.author;
        newsletter.viewers = [];
        newsletter.rating = 0;
        newsletter.summary = body.summary;
        newsletter.featuredImageUrl = body.featuredImageUrl;
        newsletter.notified = false;
        newsletter.youtube = body.youtube;
        const data = await postNewsletter(newsletter);
        return ResponseModel.ok(data, 'Newsletter posted successfully.');
    }
    catch (e) {
        const response = e instanceof ResponseModel ? e : new ResponseModel(null, StatusCode.ERROR, e.message);
        return response.generate();
    }
}
export const main = middyfy(postNewsletterHandler);