import { Schema, model } from 'dynamoose';

const AccessTokenSchema = new Schema({
  token: {
    type: String,
    hashKey: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  expiresAt: {
    type: Number,
    required: true,
    default: 3600,
  },
});

export const AccessTokenModel = model('AccessToken', AccessTokenSchema, {
  expires: { attribute: 'expiresAt' },
});
