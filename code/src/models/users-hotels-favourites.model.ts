import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo } from '@sequelize/core/decorators-legacy';
import { User } from './user.model';
import { Hotel } from './hotel.model';

@Table({
    tableName: 'users-hotels-favourites',
    timestamps: true
})
export class UsersHotelsFavourites extends Model<InferAttributes<UsersHotelsFavourites>, InferCreationAttributes<UsersHotelsFavourites>> {
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
} 