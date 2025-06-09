import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo, Unique } from '@sequelize/core/decorators-legacy';
import { User } from './user.model';
import { Role } from './role.model';

@Table({
    tableName: 'sign_up_codes',
    timestamps: true
})
export class SignUpCodes extends Model<InferAttributes<SignUpCodes>, InferCreationAttributes<SignUpCodes>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @NotNull
    declare roleId: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare code: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare expiresAt: Date;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare createdBy: number;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare updatedAt: CreationOptional<Date>;

    @BelongsTo(() => Role, {
        foreignKey: 'roleId'
    })
    declare role?: Role;

    @BelongsTo(() => User, {
        foreignKey: 'createdBy'
    })
    declare user?: User;
}