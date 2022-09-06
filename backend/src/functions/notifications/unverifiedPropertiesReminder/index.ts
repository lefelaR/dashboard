import { handlerPath } from "@common/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  tracing: true,
  timeout: 30,
  events: [
    {
      http: {
        method: "get",
        path: "/properties/verifications-reminder",
        cors: true,
      },
    },
    {
      schedule: "rate(24 hours)",
    },
  ],
};
