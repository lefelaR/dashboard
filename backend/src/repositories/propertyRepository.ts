import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";
import { v4 as UUID } from "uuid";
import PropertyModel, {
  BuildingDetails,
  LevyModel,
  OwnerModel,
} from "@models/property.model";
import PropertyEvents from "@models/property.events";
import Interaction from "@models/interaction.model";

const TableName = process.env.PROPERTY_TABLE;

export const addProperty = async (property: PropertyModel) => {
  property.createdAt = new Date().getTime();
  const params = {
    TableName,
    Item: {
      ...property,
      id: UUID(),
    },
  };
  await DynamoDatabaseService.create(params);

  //dispatch event
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onCreated.EventBusName,
          Source: PropertyEvents.onCreated.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onCreated.DetailType,
          Detail: JSON.stringify({
            description: `Property created  at ${new Date(property.createdAt)}`,
            data: property,
          }),
        },
      ],
    })
    .promise();
  return property;
};

export const updateProperty = async (property: PropertyModel) => {
  const updatedAt = new Date().getTime();
  const params = {
    TableName,
    Key: {
      id: property.id,
    },
    UpdateExpression: `
		set 
		#erfNumber = :erfNumber,
		#erfSize = :erfSize,
		#accountNumber = :accountNumber,
		#currentBalance = :currentBalance,
		#isOverdue = :isOverdue,
		#tradingAs = :tradingAs,
		#vat = :vat,
    #marketValue = :marketValue,
    #zoning = :zoning,
		#mdaAccNumber = :mdaAccNumber,
    #managementCompany = :managementCompany,
		#municipalValue = :municipalValue,
		#officeNumber = :officeNumber,
		#officeEmail = :officeEmail,
		#fax = :fax,
		#notes = :notes,
		#allocatedUserId = :allocatedUserId,
		#approached = :approached`,
    ExpressionAttributeNames: {
      "#erfNumber": "erfNumber",
      "#erfSize": "erfSize",
      "#accountNumber": "accountNumber",
      "#currentBalance": "currentBalance",
      "#isOverdue": "isOverdue",
      "#tradingAs": "tradingAs",
      "#vat": "vat",
      "#marketValue": "marketValue",
      "#zoning":"zoning",
      "#mdaAccNumber": "mdaAccNumber",
      "#managementCompany":"managementCompany",
      "#municipalValue": "municipalValue",
      "#officeNumber": "officeNumber",
      "#officeEmail": "officeEmail",
      "#fax": "fax",
      "#notes": "notes",
      "#allocatedUserId": "allocatedUserId",
      "#approached": "approached",
    },
    ExpressionAttributeValues: {
      ":erfNumber": property.erfNumber,
      ":erfSize": property.erfSize,
      ":accountNumber": property.accountNumber,
      ":currentBalance": Number(property.currentBalance),
      ":isOverdue": property.isOverdue ? property.isOverdue : false,
      ":tradingAs": property.tradingAs,
      ":vat": property.vat,
      ":marketValue": property.marketValue,
      ":zoning": property.zoning,
      ":mdaAccNumber": property.mdaAccNumber,
      ":managementCompany": property.managementCompany,
      ":municipalValue": property.municipalValue,
      ":officeNumber": property.officeNumber,
      ":fax": property.fax,
      ":notes": property.notes,
      ":allocatedUserId": property.allocatedUserId,
      ":approached": property.approached,
      ":officeEmail": property.officeEmail,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // Updates Item in DynamoDB table
  const result = await DynamoDatabaseService.update(params);
  //dispatch event
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onUpdated.EventBusName,
          Source: PropertyEvents.onUpdated.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onUpdated.DetailType,
          Detail: JSON.stringify({
            description: `Property Updated at ${new Date(updatedAt)}`,
            data: result,
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};

export const updateLastInteraction = async (interaction: Interaction) => {
  const updatedAt = new Date().getTime();
  const params = {
    TableName,
    Key: {
      id: interaction.propertyId,
    },
    UpdateExpression: `
		set 
		#interactionDate = :interactionDate`,
    ExpressionAttributeNames: {
      "#interactionDate": "dateOfLastInteraction",
    },
    ExpressionAttributeValues: {
      ":interactionDate": interaction.createdAt,
    },
    ReturnValues: "UPDATED_NEW",
  };

  const result = await DynamoDatabaseService.update(params);

  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onUpdated.EventBusName,
          Source: PropertyEvents.onUpdated.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onUpdated.DetailType,
          Detail: JSON.stringify({
            description: `Property Updated at ${new Date(updatedAt)}`,
            data: result,
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};

export const updateBuildingDetails = async (
  propertyId: string,
  building: BuildingDetails
) => {
  const updatedAt = new Date().getTime();
  const params = {
    TableName,
    Key: {
      id: propertyId,
    },
    UpdateExpression: `
		set #building = :building,
		#updatedAt = :timestamp`,
    ExpressionAttributeNames: {
      "#building": "building",
      "#updatedAt": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":building": building,
      ":timestamp": updatedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // Updates Item in DynamoDB table
  const result = await DynamoDatabaseService.update(params);
  //dispatch event
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onUpdated.EventBusName,
          Source: PropertyEvents.onUpdated.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onUpdated.DetailType,
          Detail: JSON.stringify({
            description: `Property Updated at ${new Date(updatedAt)}`,
            data: result,
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};
export const updatePropertyLevy = async (id: string, levy: LevyModel) => {
  const updatedAt = new Date().getTime();
  if (levy.verified === true) {
    levy.lastVerificationDate = updatedAt;
  }
  const params = {
    TableName,
    Key: {
      id,
    },
    UpdateExpression: `
		set  #levy = :levy,#updatedAt = :timestamp`,
    ExpressionAttributeNames: {
      "#levy": "levy",
      "#updatedAt": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":levy": levy,
      ":timestamp": updatedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // Updates Item in DynamoDB table
  const result = await DynamoDatabaseService.update(params);
  //dispatch event
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onUpdated.EventBusName,
          Source: PropertyEvents.onUpdated.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onUpdated.DetailType,
          Detail: JSON.stringify({
            description: `Property Updated at ${new Date(updatedAt)}`,
            data: result,
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};

export const updateOwnerDetails = async (
  propertyId: string,
  owner: OwnerModel
) => {
  const updatedAt = new Date().getTime();
  if (owner.verified === true) {
    owner.lastVerificationDate = updatedAt;
  }
  const params = {
    TableName,
    Key: {
      id: propertyId,
    },
    UpdateExpression: `
		set  #owner = :owner,#updatedAt = :timestamp`,
    ExpressionAttributeNames: {
      "#owner": "owner",
      "#updatedAt": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":owner": owner,
      ":timestamp": updatedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // Updates Item in DynamoDB table
  const result = await DynamoDatabaseService.update(params);
  //dispatch event
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onUpdated.EventBusName,
          Source: PropertyEvents.onUpdated.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onUpdated.DetailType,
          Detail: JSON.stringify({
            description: `Property Updated at ${new Date(updatedAt)}`,
            data: result,
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};

export const getProperty = async (propertyId: string) => {
  const params = {
    TableName,
    Key: {
      id: propertyId,
    },
  };
  return (await DynamoDatabaseService.get(params)).Item;
};

export const getPropertyByErf = async (erf: string) => {
  const params = {
    TableName,
    FilterExpression: "#erf = :erfNumber",
    ExpressionAttributeNames: {
      "#erf": "erfNumber",
    },
    ExpressionAttributeValues: {
      ":erfNumber": erf,
    },
  };
  return await DynamoDatabaseService.scan(params);
};

export const getAllProperties = async () => {
  const params = {
    TableName,
  };
  return await DynamoDatabaseService.scan(params);
};

export const getUnverifiedProperties = async () => {
  const params = {
    TableName,
    FilterExpression: "#own.#ver = :bool OR #lev.#ver = :bool",
    ExpressionAttributeNames: {
      "#own": "owner",
      "#ver": "verified",
      "#lev": "levy",
    },
    ExpressionAttributeValues: {
      ":bool": false,
    },
  };
  return await DynamoDatabaseService.scan(params);
};

export const deleteProperty = async (propertyId: string) => {
  const params = {
    TableName,
    Key: {
      id: propertyId,
    },
  };
  await DynamoDatabaseService.delete(params);
  //dispatch event
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onDeleted.EventBusName,
          Source: PropertyEvents.onDeleted.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onDeleted.DetailType,
          Detail: JSON.stringify({
            description: `Property Deleted at ${new Date()}`,
            data: params,
          }),
        },
      ],
    })
    .promise();
  return params.Key.id;
};

export const flagPropertyForValidation = async (propertyId: string, message: string) => {
  const property = await getProperty(propertyId);
  const propertyLevy = property.levy as LevyModel;
  const owner = property.owner as OwnerModel;
  propertyLevy.verified = false;
  owner.verified = false;
  const flaggedAt = new Date().getTime();

  await updateOwnerDetails(propertyId, owner);
  await updatePropertyLevy(propertyId, propertyLevy);

  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: PropertyEvents.onFlagged.EventBusName,
          Source: PropertyEvents.onFlagged.Source + "-" + process.env.STAGE,
          DetailType: PropertyEvents.onFlagged.DetailType,
          Detail: JSON.stringify({
            description: `Property flagged at ${new Date(flaggedAt)}`,
            data: {
              property,
              dateFlagged: flaggedAt,
              message
            },
          }),
        },
      ],
    })
    .promise();
}
