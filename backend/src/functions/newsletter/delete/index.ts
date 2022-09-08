import { handlerPath } from "@common/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "delete",
				path: "/newsletters/{id}",
				cors: true,
			},
		},
	],
};
