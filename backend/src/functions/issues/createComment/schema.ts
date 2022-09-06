export default {
    type: "object",
    properties: {
        message: {type: 'string'},
        author: {type: 'string'},
    },
    required: ['message','author']
} as const;
