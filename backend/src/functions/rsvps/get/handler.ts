import "source-map-support/register";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { APIGatewayEvent } from "aws-lambda";
import { getRSVP } from "@repositories/rsvpRepository";

const getRSVPHandler = async (event: APIGatewayEvent) => {
  try {
    const rsvpId = event.pathParameters.id;
    const data = await getRSVP(rsvpId);
    if (!data)
      return ResponseModel.notFound(
        null,
        `RSVP with id ${rsvpId} was not found`
      );
    return ResponseModel.ok(data, "Fetched RSVP");
  } catch (e) {
    const response =
      e instanceof ResponseModel
        ? e
        : new ResponseModel(null, StatusCode.ERROR, e.message);
    return response.generate();
  }
};
export const main = middyfy(getRSVPHandler);
