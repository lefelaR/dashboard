import schema from "./schema";
import { handlerPath } from "@common/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	tracing: true,
	events: [
		{
			http: {
				method: "post",
				path: "/issues",
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