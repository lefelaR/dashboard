export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    status: { type: 'string' },
  },
  required: ['status'],
} as const;
