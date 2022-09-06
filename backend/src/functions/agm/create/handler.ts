import "source-map-support/register";

import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";

import { uploadDocuments } from "@repositories/agmRepository";

const uploadDocumentsHandler = async (event) => {
  try {
    const { body } = event;

    const docDetails = {
      title: body.fileName,
      url: body.url,
    };
    const data = await uploadDocuments(docDetails);
    return new ResponseModel(
      data,
      StatusCode.Created,
      "Upload successful"
    ).generate();
  } catch (e) {
    const response =
      e instanceof ResponseModel
        ? e
        : new ResponseModel(null, StatusCode.ERROR, e.message);
    return response.generate();
  }
};
export const main = middyfy(uploadDocumentsHandler);
