import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: 'users_roles',
    timestamps: false
})
export class UsersRoles extends Model<InferAttributes<UsersRoles>, InferCreationAttributes<UsersRoles>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @NotNull
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @NotNull
    declare roleId: number;
}