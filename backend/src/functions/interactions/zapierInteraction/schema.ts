export default {
    type: "object",
    properties: {
        subject: { type: 'string' },
        type: { type: 'string' },
        notes: { type: 'string' },
        userEmail: {type: 'string'}
    },
    required: ['subject','notes', 'type', "userEmail"]
} as const;
