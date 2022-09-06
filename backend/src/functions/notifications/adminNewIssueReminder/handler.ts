import 'source-map-support/register';
import { middyfy } from '@common/lambda';
import { getAll } from "@repositories/issuesRepository";
import { IssueStatus } from "@models/issues/issue.model";
import { sendEmail } from "@services/simpleEmailingService";

function timeDiffCalc(dateNow, oldDate) {
    let diffInMilliSeconds = Math.abs(dateNow - oldDate) / 1000;
    // calculate hours
    return Math.floor(diffInMilliSeconds / 3600) % 24;
}

const notify = async () => {
    const adminEmails = [process.env.ADMIN_EMAIL];
    const issues = await getAll();

    const newlyOpenIssues = issues.Items.filter(x => {
        const currentTime = new Date();
        const issueCreation = new Date(x.createdAt)

        const isLessThan24Hours = timeDiffCalc(currentTime, issueCreation) < 24
        return (x.status === IssueStatus.PENDING && isLessThan24Hours);
    });

    if (newlyOpenIssues.length > 0) {
        const message = `You have ${newlyOpenIssues.length} newly opened issues.`
        const subject = "\"Newly Open Issues Reminder\""

        try {
            await sendEmail(message, subject, adminEmails);
        } catch (e) {
            console.log('There was an error sending: ', e);
        }
    }
}
export const main = middyfy(notify);
