import { v4 as UUID } from "uuid";
import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";
import Interaction from "@models/interaction.model";
import InteractionEvents from "@models/interaction.events";

const TableName = process.env.INTERACTIONS_TABLE;

export const addInteraction = async (interaction: Interaction) => {
    interaction.id = UUID()
    interaction.createdAt = new Date().getTime();
    interaction.updatedAt = interaction.createdAt;
    const params = {
        TableName,
        Item: {
            ...interaction,
        },
    };
    await DynamoDatabaseService.create(params);
    //dispatch event
    await eventBridgeService
        .putEvents({
            Entries: [
                {
                    EventBusName: InteractionEvents.onCreated.EventBusName,
                    Source: InteractionEvents.onCreated.Source + "-" + process.env.STAGE,
                    DetailType: InteractionEvents.onCreated.DetailType,
                    Detail: JSON.stringify({
                        description: `Interaction created  at ${new Date(interaction.createdAt)}`,
                        data: interaction,
                    }),
                },
            ],
        })
        .promise();
    return interaction;
};


export const getAllInteractions = async () => {
    const params = {
        TableName,
    };
    return await DynamoDatabaseService.scan(params);
};

export const getInteraction = async (interactionId: string) => {
    const params = {
        Key: {
            id: interactionId
        },
        TableName,
    };
    return (await DynamoDatabaseService.get(params)).Item;
};

export const editInteraction = async (interaction: Interaction) => {
    const updatedAt = new Date().getTime();
    const params = {
        TableName,
        Key: {
            id: interaction.id,
        },
        UpdateExpression:
            "set #title = :title, #notes = :notes, #pId = :pId, #uId = :uId, #intType = :intType, #upAt = :upAt",
        ExpressionAttributeNames: {
            "#notes": "notes",
            "#pId": "propertyId",
            "#uId": "userId",
            "#title": "title",
            "#intType": "interactionType",
            "#upAt": "updatedAt",
        },
        ExpressionAttributeValues: {
            ":notes": interaction.notes,
            ":pId": interaction.propertyId,
            ":title": interaction.title,
            ":intType": interaction.type,
            ":uId": interaction.userId,
            ":upAt": updatedAt
        },
        ReturnValues: "UPDATED_NEW",
    };

    return await DynamoDatabaseService.update(params);
};

export const deleteInteraction = async (interactionId: string) => {

    const params = {
        TableName,
        Key: {
            id: interactionId
        }
    };
    return await DynamoDatabaseService.delete(params);
};

export const getPropertyInteractions = async (propertyId: string): Promise<any> => {
    const params = {
        TableName,
        FilterExpression: "#pId = :pId",
        ExpressionAttributeNames: {
            "#pId": "propertyId",
        },
        ExpressionAttributeValues: {
            ":pId": propertyId,
        },
    };
    return await DynamoDatabaseService.scan(params);
};

export const getUserInteractions = async (userId: string): Promise<any> => {
    const params = {
        TableName,
        FilterExpression: "#uId = :uId",
        ExpressionAttributeNames: {
            "#uId": "userId",
        },
        ExpressionAttributeValues: {
            ":uId": userId,
        },
    };
    return await DynamoDatabaseService.scan(params);
};

