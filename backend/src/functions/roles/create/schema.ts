export default {
    type: "object",
    properties: {
        title: {type: 'string'},
        description: {type: 'string'},
        permissions:{type:'array'}
    },
    required: ['title','description']
} as const;
