import DynamoDatabaseService from "@services/DynamoDatabaseService";
import RSVP from "@models/rsvp.model";

const TableName = process.env.RSVP_TABLE;

export const addRSVP = async (rsvp: RSVP) => {
  rsvp.dateAGM = String(new Date().getTime());

  const params = {
    TableName,
    Item: {
      ...rsvp,
    },
  };
  await DynamoDatabaseService.create(params);
  return rsvp.rsvpId;
};

export const getAllRSVP = async () => {
  const params = {
    TableName,
  };
  return await DynamoDatabaseService.scan(params);
};

export const getRSVP = async (rsvpId: string) => {
  const params = {
    TableName,
    Key: { rsvpId: rsvpId },
  };
  return (await DynamoDatabaseService.get(params)).Item;
};
