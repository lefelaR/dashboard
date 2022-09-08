import Issue from "@models/issues/issue.model";

export default function generateNewRef(issues: any[]) {
    try {
        if (issues.length === 0) return "WYN-001";

        const sortedIssues = issues.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const lastIssue: Issue = sortedIssues[sortedIssues.length - 1];
        const lastIssueRef = lastIssue.reference;

        const [str, num] = lastIssueRef.split("-");
        let number = Number.parseInt(num);
        number += 1;
        let referenceNumber;
        if (number < 10) {
            referenceNumber = `${str}-00${number}`;
        } else if (number >= 10 && number < 100) {
            referenceNumber = `${str}-0${number}`;
        } else {
            referenceNumber = `${str}-${number}`;
        }
        return referenceNumber;
    } catch (err) {
        console.log(err);
        return err;
    }
}
