import { mongoose } from '../connection.js'

const { Schema } = mongoose
const user = new Schema(
  {
    firstName: {
      type: String,
      require: true,
      index: true,
    },
    lastName: {
      type: String,
      require: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      index: true,
    },
    password: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
      default: null,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    admin: {
      type: Boolean,
      require: true,
      default: false,
    },
    permissions: {
      createPoll: {
        type: Boolean,
        require: true,
        default: true,
      },
      respond: {
        type: Boolean,
        require: true,
        default: true,
      },
      login: {
        type: Boolean,
        require: true,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

class User {
  static dump(user) {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      admin: user.admin,
      image: user.image,
      permissions: user.permissions,
      register: user.createdAt,
      lastUpdate: user.updatedAt,
      ...(user.accessToken ? { accessToken: user.accessToken } : {}),
      ...(user.refreshToken ? { refreshToken: user.refreshToken } : {}),
    }
  }
}

user.loadClass(User)

export default mongoose.model('User', user)
