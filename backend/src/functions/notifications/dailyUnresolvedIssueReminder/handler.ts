import "source-map-support/register";
import { middyfy } from "@common/lambda";
import { getAll } from "@repositories/issuesRepository";
import Issue, { IssueStatus } from "@models/issues/issue.model";
import { sendEmail } from "@services/simpleEmailingService";
import Assignee from "@models/issues/assignee.model";

const notify = async () => {
  const adminEmails = [process.env.ADMIN_EMAIL];
  const issues = await getAll(true);

  const unresolvedIssues = issues.Items.filter((x) => {
    return x.status !== IssueStatus.RESOLVED && IssueStatus.CANCELLED;
  });
  const mappedIssues = unresolvedIssues.map(
    (issue: Issue) =>
      `<a href="wynberg.org.za/issues/${issue.reference}">${issue.description}</a><br/>`
  );
  const htmlIssueList = mappedIssues.join(",").replace(/,/g, "");

  const subject = "In Progress Issues Daily Reminder";
  const message = (position) =>
    `${position}, You have ${unresolvedIssues.length} in progress issues which are not yet resolved.
        <br/> Issues :<br/> ${htmlIssueList}`;

  if (unresolvedIssues.length > 0) {
    try {
      await sendEmail(message("Admin"), subject, adminEmails);

      unresolvedIssues.forEach((issue: Issue) => {
        if (!!issue.assignees && issue.assignees.length > 0) {
          const assigneesEmails = [];
          issue.assignees.forEach((assignee: Assignee) => {
            if (!adminEmails.includes(assignee.email)) {
              assigneesEmails.push(assignee.email);
            }
          });
          const assigneeMessage = `
                    This is a daily reminder that you have been assigned to issue Ref "${issue.reference}".`;
          (async () => sendEmail(assigneeMessage, subject, assigneesEmails))();
        }
      });
    } catch (e) {
      console.log("There was an error sending email - ", e);
    }
  }
};
export const main = middyfy(notify);
