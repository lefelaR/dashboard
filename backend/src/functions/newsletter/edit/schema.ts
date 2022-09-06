export default {
    type: "object",
    properties: {
        summary: { type: "string" },
        youtube: { type: "string" },
        status: { type: "string" },
        slug: { type: "string" },
        html: { type: "string" },
        rating: { type: "number" },
        notified: { type: "boolean" },
        author: { type: "string" },
        featuredImageUrl: { type: "string" },
        title: { type: "string" },
    },
    required: ["html", "featuredImageUrl", "title", "author"]
} as const;
