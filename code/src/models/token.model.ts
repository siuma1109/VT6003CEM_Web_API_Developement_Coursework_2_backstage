import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, BelongsTo } from '@sequelize/core/decorators-legacy';
import { User } from './user.model';

@Table({
    tableName: 'tokens',
    timestamps: true
})
export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare accessToken: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare refreshToken: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare accessTokenExpiresAt: Date;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare refreshTokenExpiresAt: Date;

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
}