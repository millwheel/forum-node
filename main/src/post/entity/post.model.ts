import * as dynamoose from 'dynamoose';

const postSchema = new dynamoose.Schema({
  postId: {
    type: Number,
    hashKey: true,
    required: true,
  },
  writerId: {
    type: Number,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  tagList: {
    type: Array,
    schema: [String],
  },
});

export const PostModel = dynamoose.model('forum_post', postSchema);
