import * as dynamoose from 'dynamoose';

const tagSchema = new dynamoose.Schema({
  tagName: {
    type: String,
    hashKey: true,
    required: true,
  },
  userId: {
    type: Array,
    schema: [Number],
  },
});

export const tagModel = dynamoose.model('forum_tag', tagSchema);
