import { handlerPath } from "@common/handlerResolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    tracing: true,
    timeout: 15,
    events: [
        {
            http: {
                method: "get",
                path: "/mail-subscribers/",
                cors: true,
            },
        },
    ],
};
