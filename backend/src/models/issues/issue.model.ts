import Comment from "./comment.model";
import CoordinatesModel from "./Location.model";
import Assignee from "@models/issues/assignee.model";
export enum IssueStatus {
  PENDING = "Pending",
  RESOLVED = "Resolved",
  CANCELLED = "Cancelled",
  INPROGRESS = "InProgress",
}

export default class Issue {
  id: string = "";
  categoryId: string = "";
  jobReference: string = "";
  coordinates?: undefined | CoordinatesModel = new CoordinatesModel(0, 0);
  description: string = "";
  reference: string = "";
  status: IssueStatus = IssueStatus.PENDING;
  createdBy: string = "";
  creatorEmail: string = "";
  updatedAt: number = 0;
  createdAt: number = 0;
  inProgressAt: number = 0;
  resolvedAt: number = 0;
  cancelledAt: number = 0;
  comments: Comment[] = [];
  assignees: Assignee[] = [];
  images: string[] = [];
  startTime : number = 0;
  endTime : number = 0;
  cause: string = "";
}
