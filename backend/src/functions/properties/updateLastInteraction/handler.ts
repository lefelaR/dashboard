import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import {
  getProperty,
  updateLastInteraction,
} from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";
import Interaction from "@models/interaction.model";

const updateLastInteracted = async (event) => {
  try {
    const interaction: Interaction = event.detail.data;
    const dbItem = await getProperty(interaction.propertyId);

    if (!dbItem) {
      return ResponseModel.notFound(
        null,
        `Property with id ${interaction.propertyId} does not exist!`
      );
    }
    const data = await updateLastInteraction(interaction);

    return ResponseModel.ok(data, "Last interacted date updated");
  } catch (e) {
    return errorResponse(e);
  }
};
export const main = middyfy(updateLastInteracted);
