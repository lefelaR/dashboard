import { handlerPath } from "@common/handlerResolver";
import schema from "./schema";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: '/newsletters/',
                cors: true,
                request: {
					schema: {
						"application/json": schema,
					},
				},
            }
        }
    ]
}