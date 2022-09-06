import "source-map-support/register";
import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import ResponseModel, { StatusCode } from "@common/response.model";
import { middyfy } from "@common/lambda";

import { addRSVP } from "@repositories/rsvpRepository";
import RSVP from "@models/rsvp.model";

const addRSVPHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    try {
      const { body } = event;
      const rsvp = new RSVP();
      rsvp.firstName = body.firstName;
      rsvp.lastName = body.lastName;
      rsvp.phoneNumber = body.phoneNumber;
      rsvp.email = body.email;
      rsvp.isOwner = body.isOwner;
      rsvp.dateAGM = body.dateAGM;
      rsvp.proxy = body.proxy;
      rsvp.proxyDetails = body.proxyDetails;
      rsvp.erfNumber = body.erfNumber as string[];

      const data = await addRSVP(rsvp);

      return ResponseModel.ok(data, "RSVP added");
    } catch (e) {
      const response =
        e instanceof ResponseModel
          ? e
          : new ResponseModel(null, StatusCode.ERROR, e.message);
      return response.generate();
    }
  };
export const main = middyfy(addRSVPHandler);
