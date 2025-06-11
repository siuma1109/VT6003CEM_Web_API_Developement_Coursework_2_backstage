import { importModels, Sequelize } from '@sequelize/core';
import config from '../configs/database.config';
import { PostgresDialect } from '@sequelize/postgres';
import { User } from '../models/user.model';
import { UserTokens } from '../models/user-tokens.model';
import { UsersRoles } from '../models/users-roles.model';
import { Role } from '../models/role.model';
import { SignUpCodes } from '../models/sign-up-codes.model';
import { Hotel } from '../models/hotel.model';
import { UsersHotelsFavourites } from '../models/users-hotels-favourites.model';
import { ChatRoom } from '../models/chat-room.model';
import { Message } from '../models/message.model';

// Create and export the Sequelize instance for the application
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: dbConfig.database!,
  user: dbConfig.username!,
  password: dbConfig.password!,
  host: dbConfig.host!,
  port: dbConfig.port!,
  ssl: false,
  clientMinMessages: 'notice',
  models: [
    User,
    UserTokens,
    Role,
    UsersRoles,
    SignUpCodes,
    Hotel,
    UsersHotelsFavourites,
    ChatRoom,
    Message
  ]
});

export default sequelize;