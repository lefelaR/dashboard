import { handlerPath } from "@common/handlerResolver";
import schema from "./schema";
export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	tracing: true,
	events: [
		{
			http: {
				method: "post",
				path: "/logs/",
				request: {
					schema: {
						"application/json": schema,
					},
				},
				cors: true,
			},
		},
	],
};
