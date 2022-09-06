import { v4 as UUID } from "uuid";
import DynamoDatabaseService from "@services/DynamoDatabaseService";
import eventBridgeService from "@services/eventBridgeService";
import Issue, { IssueStatus } from "../models/issues/issue.model";
import Comment from "@models/issues/comment.model";
import Assignee from "@models/issues/assignee.model";
import generateNewRef from "@common/refGenerator";
import IssueEvents from "@models/issues/issue.events";
import { getAllUsers } from "@repositories/userRepository";
import moment from "moment";

const TableName = process.env.ISSUE_TABLE;

export const createIssue = async (issue: Issue): Promise<Issue | null> => {
  issue.id = UUID();
  const previousIssues = await getAll();
  const issueRefNumber = generateNewRef(previousIssues.Items);
  //Add Basil as default assignee
  issue.assignees.push({
    name: "Adriano Iorio",
    email: process.env.ADMIN_EMAIL,
    assignedAt: new Date().getTime(),
  });
  issue.reference = issueRefNumber;
  issue.createdAt = new Date().getTime();
  const formattedDate = moment(new Date()).format("Do MMMM YYYY, h:mm a");
  // Initialise DynamoDB PUT parameters
  const params = {
    TableName,
    Item: {
      ...issue,
    },
  };
  // Inserts item into DynamoDB table
  await DynamoDatabaseService.create(params);
  await getAllUsers().then((res) => {
    res.Items.map((user) => {
      if (user.id === issue.createdBy) {
        issue.createdBy = `${user.firstName} ${user.lastName}`;
      }
    });
  });
  //Dispatch issue
  const eventParams = {
    EventBusName: IssueEvents.onCreated.EventBusName,
    Source: IssueEvents.onCreated.Source + "-" + process.env.STAGE,
    DetailType: IssueEvents.onCreated.DetailType,
    Detail: JSON.stringify({
      description: "Issue Created at " + new Date(params.Item.createdAt),
      data: { issue, reference: issueRefNumber, formattedDate },
    }),
  };
  await eventBridgeService
    .putEvents({
      Entries: [eventParams],
    })
    .promise();

  return issue;
};

export const updateIssue = async (issue: Issue): Promise<any | null> => {
  // Initialise DynamoDB UPDATE parameters
  const updatedAt = new Date().getTime();
  const formattedDate = moment(new Date()).format("Do MMMM YYYY, h:mm a");
  const params = {
    TableName,
    Key: {
      id: issue.id,
    },
    UpdateExpression: "set #description = :description, updatedAt = :timestamp",
    ExpressionAttributeNames: {
      "#description": "description",
    },
    ExpressionAttributeValues: {
      ":description": issue.description,
      ":timestamp": updatedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // Updates Item in DynamoDB table
  const result = await DynamoDatabaseService.update(params);
  const eventParams = {
    EventBusName: IssueEvents.onUpdated.EventBusName,
    Source: IssueEvents.onUpdated.Source + "-" + process.env.STAGE,
    DetailType: IssueEvents.onUpdated.DetailType,
    Detail: JSON.stringify({
      description: "Issue updated at " + new Date(updatedAt),
      data: { issue, formattedDate },
    }),
  };

  await eventBridgeService
    .putEvents({
      Entries: [eventParams],
    })
    .promise();
  return result;
};

//update issue status
export const updateIssueStatus = async (issue: Issue): Promise<any | null> => {
  // Initialise DynamoDB UPDATE parameters
  const updatedAt = new Date().getTime();
  const formattedDate = moment(new Date()).format("Do MMMM YYYY, h:mm a");
  if (issue.status === IssueStatus.PENDING) {
    issue.inProgressAt = 0;
    issue.resolvedAt = 0;
    issue.cancelledAt = 0;
  }
  if (issue.status === IssueStatus.INPROGRESS) {
    issue.resolvedAt = 0;
    issue.cancelledAt = 0;
  }
  if (issue.status === IssueStatus.RESOLVED) {
    issue.cancelledAt = 0;
  }
  if (issue.status === IssueStatus.CANCELLED) {
    issue.inProgressAt = 0;
    issue.resolvedAt = 0;
  }

  const params = {
    TableName,
    Key: {
      id: issue.id,
    },
    UpdateExpression:
      "set #status = :status, updatedAt = :timestamp, inProgressAt = :inProgressAt, resolvedAt = :resolvedAt, cancelledAt = :cancelledAt",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": issue.status,
      ":timestamp": updatedAt,
      ":inProgressAt": issue.inProgressAt,
      ":resolvedAt": issue.resolvedAt,
      ":cancelledAt": issue.cancelledAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // Updates Item in DynamoDB table
  const result = await DynamoDatabaseService.update(params);
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: IssueEvents.onConditionChanged.EventBusName,
          Source:
            IssueEvents.onConditionChanged.Source + "-" + process.env.STAGE,
          DetailType: IssueEvents.onConditionChanged.DetailType,
          Detail: JSON.stringify({
            description: `Issue Status updated at ${new Date(updatedAt)}`,
            data: {
              issue,
              updatedAt,
              formattedDate,
            },
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};

export const getIssue = async (id: string): Promise<any | null> => {
  const params = {
    TableName,
    Key: {
      id: id,
    },
  };
  const result = await DynamoDatabaseService.get(params);
  return result.Item;
};

export const getIssueByRefNumber = async (refNumber: string): Promise<any> => {
  const params = {
    TableName,
    ProjectionExpression:
      "#ir, images,#usr, coordinates,createdAt, description,id,categoryId,#is,jobReference",
    FilterExpression: "#ir = :ref",
    ExpressionAttributeNames: {
      "#is": "status",
      "#ir": "reference",
      "#usr": "createdBy",
    },
    ExpressionAttributeValues: {
      ":ref": refNumber,
    },
  };
  return await DynamoDatabaseService.scan(params);
};

export const getAll = async (
  includeDetails: boolean = false
): Promise<any | null> => {
  let params;
  if (!includeDetails) {
    params = {
      TableName,
      ExpressionAttributeNames: {
        "#is": "status",
        "#ir": "reference",
      },
      ProjectionExpression:
        "id, coordinates,description,createdBy,createdAt,updatedAt,images,categoryId,#is, #ir ",
    };
  }
  const rawData = await DynamoDatabaseService.scan({
    TableName,
    ...params,
  });
  return rawData;
};

export const getUserIssues = async (userId: string): Promise<any | null> => {
  const params = {
    TableName,
    ProjectionExpression:
      "#ir, images,#usr, coordinates, description,id,categoryId,#is",
    FilterExpression: "#usr = :user",
    ExpressionAttributeNames: {
      "#is": "status",
      "#ir": "reference",
      "#usr": "createdBy",
    },
    ExpressionAttributeValues: {
      ":user": userId,
    },
  };
  const result = await DynamoDatabaseService.scan(params);
  return result.Items;
};

export const deleteIssue = async (id: string): Promise<any> => {
  const params = {
    TableName,
    Key: {
      id,
    },
  };
  const result = DynamoDatabaseService.delete(params);
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: IssueEvents.onCreated.EventBusName,
          Source: IssueEvents.onCreated.Source + "-" + process.env.STAGE,
          DetailType: IssueEvents.onCreated.DetailType,
          Detail: JSON.stringify({
            description: `Issue with id ${id} was Deleted at ${new Date()}`,
            data: params,
          }),
        },
      ],
    })
    .promise();
  return result;
};

export const addAssignee = async (
  issue: Issue,
  assignee: Assignee
): Promise<any> => {
  //Add comment to issues
  issue.assignees && issue.assignees.push(assignee);
  !issue.assignees && (issue.assignees = [assignee]);
  const assignedAt = new Date().getTime();
  const params = {
    TableName,
    Key: {
      id: issue.id,
    },
    UpdateExpression: "set #assignees = :assignees, updatedAt = :timestamp",
    ExpressionAttributeNames: {
      "#assignees": "assignees",
    },
    ExpressionAttributeValues: {
      ":assignees": issue.assignees,
      ":timestamp": assignedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  const result = await DynamoDatabaseService.update(params);
  const eventDetail = {
    issue,
    assignee,
    assignedAt,
  };
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: IssueEvents.onAssigneeAdded.EventBusName,
          Source: IssueEvents.onAssigneeAdded.Source + "-" + process.env.STAGE,
          DetailType: IssueEvents.onAssigneeAdded.DetailType,
          Detail: JSON.stringify({
            description: `Assignee ${assignee.name} Assigned to issue ${
              issue.id
            }, ref : ${issue.reference}, at ${new Date()}`,
            data: eventDetail,
          }),
        },
      ],
    })
    .promise();
  return result.Attributes;
};
//comments
export const addComment = async (
  issueId: string,
  comment: Comment
): Promise<any | null> => {
  const issue: Issue = await getIssue(issueId);
  //Add comment to issues
  issue.comments && issue.comments.push(comment);
  !issue.comments && (issue.comments = [comment]);

  const commentedAt = new Date().getTime();
  const params = {
    TableName,
    Key: {
      id: issue.id,
    },
    UpdateExpression: "set #comments = :comments, updatedAt = :timestamp",
    ExpressionAttributeNames: {
      "#comments": "comments",
    },
    ExpressionAttributeValues: {
      ":comments": issue.comments,
      ":timestamp": commentedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };
  const result = await DynamoDatabaseService.update(params);
  const eventDetail = {
    issue,
    comment,
    commentedAt,
  };
  const { EventBusName, Source, DetailType } = IssueEvents.onCommentAdded;
  const eventData = await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName,
          Source: Source + "-" + process.env.STAGE,
          DetailType,
          Detail: JSON.stringify({
            description: `${comment.author} commented on issue ${
              issue.reference
            } at ${new Date(commentedAt)}`,
            data: eventDetail,
          }),
        },
      ],
    })
    .promise();
  console.log("commented event Data", eventData);
  return result.Attributes;
};

export const getIssueComments = async (
  issueId: string
): Promise<any | null> => {
  const params = {
    TableName,
    Key: {
      id: issueId,
    },
  };
  const result = await DynamoDatabaseService.get(params);
  return result.Item.comments;
};

export const addIssueJobReference = async (
  issueId: string,
  jobReference: string
) => {
  const updatedAt = new Date().getTime();
  const params = {
    TableName,
    Key: {
      id: issueId,
    },
    UpdateExpression:
      "set #jobReference = :jobReference, updatedAt = :timestamp",
    ExpressionAttributeNames: {
      "#jobReference": "jobReference",
    },
    ExpressionAttributeValues: {
      ":jobReference": jobReference,
      ":timestamp": updatedAt,
    },
    ReturnValues: "UPDATED_NEW",
  };

  const result = await DynamoDatabaseService.update(params);
  await eventBridgeService
    .putEvents({
      Entries: [
        {
          EventBusName: IssueEvents.onUpdated.EventBusName,
          Source: IssueEvents.onUpdated.Source + "-" + process.env.STAGE,
          DetailType: IssueEvents.onUpdated.DetailType,
          Detail: JSON.stringify({
            description: "Issue Job assigned at " + new Date(updatedAt),
            data: { params, result },
          }),
        },
      ],
    })
    .promise();
  return result;
};
