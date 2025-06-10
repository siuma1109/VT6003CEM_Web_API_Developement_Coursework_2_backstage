import { Hotel } from '../models/hotel.model';
import { Op } from 'sequelize';
import { InferCreationAttributes } from '@sequelize/core';
import { PaginatedResult } from '../utils/model.util';
import { paginate } from '../utils/model.util';

export class HotelRepository {
    async findAll(options: any = {}) {
        return await Hotel.findAll(options);
    }

    async paginate(page: number, limit: number): Promise<PaginatedResult<Hotel>> {
        return await paginate(Hotel, page, limit);
    }

    async findById(id: number) {
        return await Hotel.findByPk(id);
    }

    async create(hotelData: InferCreationAttributes<Hotel>) {
        return await Hotel.create(hotelData);
    }

    async update(id: number, hotelData: Partial<Hotel>) {
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return null;
        return await hotel.update(hotelData);
    }

    async delete(id: number) {
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return false;
        await hotel.destroy();
        return true;
    }

    async findByHotelBedsId(hotelBedsId: number) {
        return await Hotel.findOne({
            where: { hotelBedsId }
        });
    }

    async searchHotels(query: string) {
        return await Hotel.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } },
                    { city: { [Op.like]: `%${query}%` } }
                ]
            } as any
        });
    }
} 