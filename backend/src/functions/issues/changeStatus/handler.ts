import "source-map-support/register";
import { ValidatedEventAPIGatewayProxyEvent } from "@common/apiGateway";
import { middyfy } from "@common/lambda";

import ResponseModel, { StatusCode } from "@common/response.model";
import Issue, { IssueStatus } from "@models/issues/issue.model";
import { getIssue, updateIssueStatus } from "@repositories/issuesRepository";
import schema from "./schema";

const updateIssueStatusHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const id = event.pathParameters.id;
  const { body }: any = event;

  const { status } = body;

  try {
    const dbItem: Issue = await getIssue(id);

    if (!dbItem)
      return new ResponseModel(
        {},
        StatusCode.NOT_FOUND,
        `Item with id ${id} does not exist.`
      ).generate();
    switch (status.toUpperCase()) {
      case "INPROGRESS":
        dbItem.status = IssueStatus.INPROGRESS;
        dbItem.inProgressAt = new Date().getTime();
        break;
      case "PENDING":
        dbItem.status = IssueStatus.PENDING;
        break;
      case "CANCELLED":
        dbItem.status = IssueStatus.CANCELLED;
        dbItem.cancelledAt = new Date().getTime();
        break;
      case "RESOLVED":
        dbItem.status = IssueStatus.RESOLVED;
        dbItem.resolvedAt = new Date().getTime();
        break;
      default:
        return new ResponseModel(
          {},
          StatusCode.BAD_REQUEST,
          `Invalid status.`
        ).generate();
    }
    const data = await updateIssueStatus(dbItem);
    return ResponseModel.ok(data, "issue Status changed");
  } catch (e) {
    const response =
      e instanceof ResponseModel
        ? e
        : new ResponseModel(null, StatusCode.ERROR, e.message);
    return response.generate();
  }
};

export const main = middyfy(updateIssueStatusHandler);
