import "source-map-support/register";
import ResponseModel from "@common/response.model";
import { middyfy } from "@common/lambda";
import {
  getAllProperties,
  updateOwnerDetails,
  updatePropertyLevy,
} from "@repositories/propertyRepository";
import errorResponse from "@common/errorResponse";

const verificationReset = async () => {
  try {
    const properties = await getAllProperties();
    const data = properties.Items;

    for (let i = 0; i < data.length; i += 1) {
      const levyVerified = data[i].levy.verified;
      const ownerVerified = data[i].owner.verified;

      const currentDate = new Date().getTime();

      const levyDate =
        (currentDate - data[i].levy.lastVerificationDate) /
        (1000 * 60 * 60 * 24);
      const ownerDate =
        (currentDate - data[i].owner.lastVerificationDate) /
        (1000 * 60 * 60 * 24);
      if (levyVerified && levyDate > 122) {
        await updatePropertyLevy(data[i].id, {
          ...data[i].levy,
          verified: false,
        });
      }
      if (ownerVerified && ownerDate > 122) {
        await updateOwnerDetails(data[i].id, {
          ...data[i].owner,
          verified: false,
        });
      }
    }

    return ResponseModel.ok(undefined, "Reset the properties to unverified");
  } catch (e) {
    return errorResponse(e);
  }
};
export const main = middyfy(verificationReset);
