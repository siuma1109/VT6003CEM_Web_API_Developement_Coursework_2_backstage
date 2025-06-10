import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, Unique, BeforeCreate, ValidateAttribute, HasMany, BelongsToMany } from '@sequelize/core/decorators-legacy';
import { UserTokens } from './user-tokens.model';
import { Role } from './role.model';
import { UsersRoles } from './users-roles.model';

const bcrypt = require('bcrypt');

@Table({
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: ['password']
        }
    },
    scopes: {
        password: {
            attributes: { include: ['password'] }
        }
    }
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    @ValidateAttribute({
        notEmpty: {
            msg: 'Name cannot be empty'
        }
    })
    declare name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    @ValidateAttribute({
        isEmail: {
            msg: 'Please enter a valid email address'
        },
        notEmpty: {
            msg: 'Email cannot be empty'
        }
    })
    declare email: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare updatedAt: CreationOptional<Date>;

    @HasMany(() => UserTokens, {
        foreignKey: 'userId'
    })
    declare tokens?: UserTokens[];

    @BelongsToMany(() => Role, {
        through: UsersRoles,
        foreignKey: 'userId',
        otherKey: 'roleId'
    })
    declare roles?: Role[];

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.password) {
            instance.password = await bcrypt.hash(instance.password, 10);
        }
    }
}