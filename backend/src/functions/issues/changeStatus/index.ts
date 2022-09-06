import schema from "./schema";
import { handlerPath } from "@common/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	tracing: true,
	events: [
		{
			http: {
				method: "put",
				path: "/issues/{id}/change-status",
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
