import DynamoDatabaseService from "@services/DynamoDatabaseService";
import { v4 as UUID } from "uuid";

const TableName = process.env.AGM_TABLE;

export const getAllAGMDoc = async () => {
  const params = {
    TableName,
  };
  return await DynamoDatabaseService.scan(params);
};

export const uploadDocuments = async (doc) => {
  const documentId = UUID();
  const params = {
    Item: {
      documentId,
      createdAt: new Date().getTime().toString(),
      title: doc.title,
      url: doc.url,
    },
    TableName,
  };

  return await DynamoDatabaseService.create(params);
};
