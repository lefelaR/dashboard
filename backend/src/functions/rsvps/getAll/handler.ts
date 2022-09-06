import "source-map-support/register";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";
import { getAllRSVP } from "@repositories/rsvpRepository";

const getAllRSVPHandler = async () => {
  try {
    const data = (await getAllRSVP()).Items;
    return ResponseModel.ok(data, "Fetched all RSVPs");
  } catch (e) {
    const response =
      e instanceof ResponseModel
        ? e
        : new ResponseModel(null, StatusCode.ERROR, e.message);
    return response.generate();
  }
};
export const main = middyfy(getAllRSVPHandler);
