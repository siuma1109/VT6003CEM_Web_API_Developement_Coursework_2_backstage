import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo } from '@sequelize/core/decorators-legacy';
import { User } from './user.model';
import {Role} from './role.model';

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

    @BelongsTo(() => User, {
        foreignKey: 'userId'
    })
    declare user?: User;

    @BelongsTo(() => Role, {
        foreignKey: 'roleId'
    })
    declare role?: Role;
}