export default {
    type: "object",
    properties: {
        rating: { type: "number" },
        slug: { type: "string" },
        userId: { type: "string" },
      
    },
    required: ["rating", "slug", "userId"]
} as const;
