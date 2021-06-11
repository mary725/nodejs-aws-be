export default {
    type: 'object',
    properties: {
        count: { type: 'number', minimum: 0 },
        description: { type: 'string', minLength: 5 },
        price: { type: 'number', minimum: 0 },
        title: { type: 'string', minLength: 10 }
    },
    required: ['count', 'description', 'price', 'title']
} as const;
