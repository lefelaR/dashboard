export default {
    type: "object",
    properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        title: { type: 'string' },
        notes: { type: 'string' },
        userId: { type: 'string' },
        propertyId: { type: 'string' },
    },
    required: ['type', 'title', 'notes', 'userId', 'propertyId']
} as const;
