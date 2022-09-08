import * as AWS from 'aws-sdk';
import DynamoDatabaseService from "@services/DynamoDatabaseService";
import Newsletter from "@models/newsletter.model";
const TableName = process.env.NEWSLETTERS_TABLE;
export const getNewsletters = async () => {
    let dbParams = {
                
                TableName: TableName
            }

    return await DynamoDatabaseService.scan(dbParams);
}
export const postNewsletter = async (newsletter: Newsletter) => {
    const params = {
		TableName: TableName,
		Item: {
			...newsletter,
		},
	};
	await DynamoDatabaseService.create(params);
    return newsletter.newsletterId;
}

export const deleteNewsletter = async (newsletterId: string) => {
    const params = {
        TableName: TableName,
        Key: {
          newsletterId: newsletterId,
        },
      };
    await DynamoDatabaseService.delete(params);
    return params.Key.newsletterId;
}
export const getArticle = async (slug: string) => {
    const params = {
                TableName: TableName,
                IndexName: "slug",
                KeyConditionExpression: "#slug = :s",
				ExpressionAttributeNames: {
					"#slug": "slug"
				},
				ExpressionAttributeValues: {
					":s":slug,
				}
            }
    return (await DynamoDatabaseService.query(params));
}
export const getEditArticle = async (newsletterId: string) => {
    const params = {
        TableName: TableName,
        Key: {
          newsletterId: newsletterId,
        },
      };

    return (await DynamoDatabaseService.get(params)).Item;
}
export const editArticle = async (newsletter: Newsletter) => {
	const updatedAt = new Date().getTime();
    const params = {
		TableName: TableName,
		Key: {
			newsletterId: newsletter.newsletterId,
		},
		UpdateExpression:
			"set #summary = :summary, #featuredImageUrl = :featuredImageUrl, #author = :author, #html = :html, #title = :title,#slug = :slug, #updatedAt = :timestamp",
		ExpressionAttributeNames: {
			"#summary": "summary",
			"#featuredImageUrl": "featuredImageUrl",
			"#author": "author",
			"#updatedAt":"updatedAt",
			"#html": "html",
			"#title": "title",
			"#slug": "slug",
		},
		ExpressionAttributeValues: {
			":summary": newsletter.summary,
			":featuredImageUrl": newsletter.featuredImageUrl,
			":author": newsletter.author,
			":html": newsletter.html,
			":title": newsletter.title,
			":slug": newsletter.slug,
			":timestamp": updatedAt,
		},
		ReturnValues: "UPDATED_NEW",
	};

	return await DynamoDatabaseService.update(params);
}
export const rateArticle = async (newsletterId: string, raters: any, rating:number ) => {
	const params = {
		TableName: TableName,
		Key: {
			newsletterId: newsletterId
		},
		UpdateExpression: "set raters = :rT, rating = :r",
		ExpressionAttributeValues: {
			":rT": raters,
			":r": rating
		},
		ReturnValues: "UPDATED_NEW"
	}
	return await DynamoDatabaseService.update(params);
}