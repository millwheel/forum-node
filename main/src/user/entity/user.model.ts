import * as dynamoose from 'dynamoose';

const userSchema = new dynamoose.Schema({
  userId: {
    type: Number,
    hashKey: true,
    required: true,
  },
  username: {
    type: String,
  },
  tagList: {
    type: Array,
    schema: [String],
  },
  token: {
    type: String,
  },
});

export const UserModel = dynamoose.model('forum_user', userSchema);
