import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, ValidateAttribute } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: 'roles',
    timestamps: true,
})
export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
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

    @Attribute(DataTypes.DATE)
    @NotNull
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare updatedAt: CreationOptional<Date>;
}