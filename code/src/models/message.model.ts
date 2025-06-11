import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo } from '@sequelize/core/decorators-legacy';
import { User } from './user.model';
import { ChatRoom } from './chat-room.model';

@Table({
    tableName: 'messages',
    timestamps: true,
})
export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare chatRoomId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare senderId: number;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare content: string;

    @Attribute(DataTypes.BOOLEAN)
    declare isDeleted: CreationOptional<boolean>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare updatedAt: CreationOptional<Date>;

    @BelongsTo(() => ChatRoom, {
        foreignKey: 'chatRoomId'
    })
    declare chatRoom?: ChatRoom;

    @BelongsTo(() => User, {
        foreignKey: 'senderId'
    })
    declare sender?: User;
} 