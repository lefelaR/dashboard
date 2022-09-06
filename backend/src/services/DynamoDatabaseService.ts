import aws from "./awsService";
import * as awsXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import IConfig from "@common/config.interface";
import BusinessException from "@common/businessException.model";

type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;

// Batch write
type BatchWrite = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
type BatchWriteOutPut = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;

// Update
type UpdateItem = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutPut = AWS.DynamoDB.DocumentClient.UpdateItemOutput;

// Query
type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

// Get
type GetItem = AWS.DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;

// Delete
type DeleteItem = AWS.DynamoDB.DocumentClient.DeleteItemInput;
type DeleteItemOutput = AWS.DynamoDB.DocumentClient.DeleteItemOutput;

const getAWS: any = () => {
	if (!process.env.IS_OFFLINE) {
		return awsXRay.captureAWS(aws);
	}
	return aws;
};
const AWS = getAWS();
class DynamoDatabaseService {
	documentClient: DocumentClient;
	constructor() {
		let options: IConfig;
		if (process.env.IS_OFFLINE) {
			options = { endpoint: "http://localhost:8000" };
		}
		this.documentClient = new AWS.DynamoDB.DocumentClient(options);
	}

	public create = async (params: PutItem): Promise<PutItemOutput> => {
		try {
			return await this.documentClient.put(params).promise();
		} catch (error) {
			throw new BusinessException(`create-error: ${error}`);
		}
	};

	public batchCreate = async (
		params: BatchWrite
	): Promise<BatchWriteOutPut> => {
		try {
			return await this.documentClient.batchWrite(params).promise();
		} catch (error) {
			throw new BusinessException(`batch-write-error: ${error}`);
		}
	};

	public update = async (params: UpdateItem): Promise<UpdateItemOutPut> => {
		try {
			return await this.documentClient.update(params).promise();
		} catch (error) {
			throw new BusinessException(`update-error: ${error}`);
		}
	};

	public query = async (params: QueryItem): Promise<QueryItemOutput> => {
		try {
			return await this.documentClient.query(params).promise();
		} catch (error) {
			throw new BusinessException(`query-error: ${error}`);
		}
	};

	public get = async (params: GetItem): Promise<GetItemOutput> => {
		try {
			return await this.documentClient.get(params).promise();
		} catch (error) {
			throw new BusinessException(`get-error: ${error}`);
		}
	};

	public delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
		try {
			return await this.documentClient.delete(params).promise();
		} catch (error) {
			throw new BusinessException(`delete-error: ${error}`);
		}
	};

	public async scan(params): Promise<any> {
		try {
			return await this.documentClient.scan(params).promise();
		} catch (e) {
			throw new BusinessException(`get-all-error: ${e}`);
		}
	}
}

export default new DynamoDatabaseService();
