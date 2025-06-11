import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo, HasMany } from '@sequelize/core/decorators-legacy';
import { User } from './user.model';
import { Hotel } from './hotel.model';
import { Message } from './message.model';

@Table({
    tableName: 'chat_rooms',
    timestamps: true,
})
export class ChatRoom extends Model<InferAttributes<ChatRoom>, InferCreationAttributes<ChatRoom>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare hotelId: number;

    @Attribute(DataTypes.DATE)
    declare newMessageTime: Date;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare updatedAt: CreationOptional<Date>;

    @BelongsTo(() => User, {
        foreignKey: 'userId'
    })
    declare user?: User;

    @BelongsTo(() => Hotel, {
        foreignKey: 'hotelId'
    })
    declare hotel?: Hotel;

    @HasMany(() => Message, {
        foreignKey: 'chatRoomId'
    })
    declare messages?: Message[];
} 