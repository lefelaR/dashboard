import schema from "./schema";
import { handlerPath } from "@common/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	tracing: true,
	events: [
		{
			http: {
				method: "put",
				path: "/properties/{id}/owner",
				cors: true,
				request: {
					schema: {
						"application/json": schema,
					},
				},
			},
		},
	],
};
