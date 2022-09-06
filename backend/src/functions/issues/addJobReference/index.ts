import schema from "./schema";
import { handlerPath } from "@common/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	tracing: true,
	events: [
		{
			http: {
				method: "post",
				path: "/issues/{id}/add-job-reference",
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
