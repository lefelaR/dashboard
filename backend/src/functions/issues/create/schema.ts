const locationSchema = {
    type: "object",
    properties:{
        longitude:{type:"number"},
        latitude:{type:"number"},
    },
    // required: ['longitude','latitude']
}
export default {
    type: "object",
    properties: {
        description: {type: 'string'},
        createdBy: {type: 'string'},
        creatorEmail:{type: 'string'},
        categoryId:{type:'string'},
        images:{type: 'array'},
        coordinates:locationSchema,
    },
    required: ['categoryId','description','creatorEmail']
} as const;
