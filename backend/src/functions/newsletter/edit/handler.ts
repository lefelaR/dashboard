import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import {getEditArticle, editArticle} from "@repositories/newsletterRepository";
import errorResponse from '@common/errorResponse';
import Newsletter from "@models/newsletter.model";

const editNewsletterHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
		try 
        {
			const newsletterId = event.pathParameters.id;
			const { body } = event;
            let slug = body.title.toLowerCase().split(' ').join('-');

            const editItem = await getEditArticle(newsletterId);

            if (!editItem) {
				return ResponseModel.notFound(
					null,
					`Article with id ${newsletterId} does not exist!`
				);
			}
            editItem.summary = body.summary;
            editItem.youtube = body.youtube;
            editItem.status = body.status;
            editItem.slug = slug;
            editItem.html = body.html;
            editItem.author =  body.author;
            editItem.featuredImageUrl = body.featuredImageUrl;
            editItem.title = body.title;

            const data = await editArticle(editItem as Newsletter);
            return  ResponseModel.ok(data, 'Newsletter Updated.');

		} 
        catch (e) 
        {
			return errorResponse(e);
		}
	};
export const main = middyfy(editNewsletterHandler);