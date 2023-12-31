import * as dynamoose from 'dynamoose';

const tagSchema = new dynamoose.Schema({
  tagName: {
    type: String,
    hashKey: true,
    required: true,
  },
  userIds: {
    type: Array,
    schema: [Number],
  },
});

export const TagModel = dynamoose.model('forum_tag', tagSchema);
