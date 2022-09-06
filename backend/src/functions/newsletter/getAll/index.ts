import { handlerPath } from "@common/handlerResolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: '/newsletters',
                cors: true,
            }
        }
    ]
}
