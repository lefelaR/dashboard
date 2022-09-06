import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getProperty, updateProperty } from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";
import PropertyModel from "@models/property.model";

const updatePropertiesHandler: ValidatedEventAPIGatewayProxyEvent<
	typeof schema
> = async (event) => {
	try {
		const propertyId = event.pathParameters.id;
		const { body } = event;

		const dbItem = await getProperty(propertyId);

		if (!dbItem) {
			return ResponseModel.notFound(
				null,
				`Property with id ${propertyId} does not exist!`
			);
		}

		const item = dbItem as PropertyModel;
		item.id = propertyId;
		item.erfNumber = body.erfNumber;
		item.erfSize = body.erfSize;
		item.officeNumber = body.officeNumber;
		item.officeEmail = body.officeEmail;
		item.fax = body.fax;
		item.accountNumber = body.accountNumber;
		item.currentBalance = body.currentBalance;
		item.isOverdue = body.isOverdue;
		item.managementCompany = body.managementCompany;
		item.propertyId = body.propertyId
		item.tradingAs = body.tradingAs;
		item.vat = body.vat;
		item.marketValue = body.marketValue,
		item.zoning = body.zoning,
		item.mdaAccNumber = body.mdaAccNumber;
		item.municipalValue = body.municipalValue;
		item.notes = body.notes;
		item.allocatedUserId = body.allocatedUserId;
		item.approached = body.approached;

		const data = await updateProperty(item);

		return ResponseModel.ok(data, "Property Owner Details updated");
	} catch (e) {
		return errorResponse(e);
	}
};
export const main = middyfy(updatePropertiesHandler);
