import "source-map-support/register";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";

import { getAllAGMDoc } from "@repositories/agmRepository";

const getAGMHandler = async () => {
  try {
    const data = await getAllAGMDoc();

    return new ResponseModel(
      data,
      StatusCode.Created,
      "Fetched all Documents"
    ).generate();
  } catch (e) {
    const response =
      e instanceof ResponseModel
        ? e
        : new ResponseModel(null, StatusCode.ERROR, e.message);
    return response.generate();
  }
};
export const main = middyfy(getAGMHandler);
