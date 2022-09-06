export default {
    type: "object",
    properties: {
        newsletterid: { type: "string" },
        summary: { type: "string" },
        rating: { type: "number" },
        youtube: { type: "string" },
        status: { type: "string" },
        slug: { type: "string" },
        html: { type: "string" },
        notified: { type: "boolean" },
        author: { type: "string" },
        featuredImageUrl: { type: "string" },
        title: { type: "string" },
    },
    required: ["html", "featuredImageUrl", "title", "author"]
} as const;
