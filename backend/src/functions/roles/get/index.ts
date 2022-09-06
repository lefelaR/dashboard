import { handlerPath } from "@common/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	tracing: true,
	events: [
		{
			http: {
				method: "get",
				path: "/roles/{id}",
				cors: true,
			},
		},
	],
};
