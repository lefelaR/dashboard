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
    required: ['id', 'title', 'notes', 'userId', 'propertyId', 'type']
} as const;
