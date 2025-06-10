import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: 'hotels',
    timestamps: true,
})
export class Hotel extends Model<InferAttributes<Hotel>, InferCreationAttributes<Hotel>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare hotelBedsId: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.TEXT)
    declare description: CreationOptional<string>;

    @Attribute(DataTypes.TEXT)
    declare address: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare postalCode: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;

    @Attribute(DataTypes.JSON)
    declare phones: CreationOptional<{
        phoneNumber: string;
        phoneType: string;
    }[]>;

    @Attribute(DataTypes.STRING)
    declare city: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare countryCode: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare stateCode: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare destinationCode: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare zoneCode: CreationOptional<string>;

    @Attribute(DataTypes.FLOAT)
    declare latitude: CreationOptional<number>;

    @Attribute(DataTypes.FLOAT)
    declare longitude: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    declare category: CreationOptional<string>;

    @Attribute(DataTypes.JSON)
    declare images: CreationOptional<string[]>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare lastUpdated: CreationOptional<Date>;

    @Attribute(DataTypes.ENUM('pending', 'active', 'inactive'))
    @NotNull
    declare status: CreationOptional<'pending' | 'active' | 'inactive'>;

    @Attribute(DataTypes.JSON)
    declare customData: CreationOptional<{
        name?: string;
        description?: string;
        images?: string[];
        facilities?: string[];
        [key: string]: any;
    }>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare createdAt: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare updatedAt: CreationOptional<Date>;
}