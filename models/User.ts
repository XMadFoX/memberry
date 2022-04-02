import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    maxlength: [80, 'Email cannot be more than 80 characters'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
