import { HotelRepository } from '../repositories/hotel.repository';
import { Hotel } from '../models/hotel.model';
import { InferCreationAttributes } from '@sequelize/core';
import { PaginatedResult } from '../utils/model.util';

export class HotelService {
    private repository: HotelRepository;

    constructor() {
        this.repository = new HotelRepository();
    }

    async getAllHotels(page: number, limit: number): Promise<PaginatedResult<Hotel>> {
        return await this.repository.paginate(page, limit);
    }

    async getHotelById(id: number) {
        return await this.repository.findById(id);
    }

    async createHotel(hotelData: InferCreationAttributes<Hotel>) {
        // Validate required fields
        if (!hotelData.name || !hotelData.hotelBedsId || !hotelData.email) {
            throw new Error('Missing required fields: name, hotelBedsId, and email are required');
        }

        // Check if hotel with same hotelBedsId already exists
        const existingHotel = await this.repository.findByHotelBedsId(hotelData.hotelBedsId);
        if (existingHotel) {
            throw new Error('Hotel with this HotelBeds ID already exists');
        }

        return await this.repository.create(hotelData);
    }

    async updateHotel(id: number, customData: Partial<Hotel['customData']>) {
        const hotel = await this.repository.findById(id);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        // Only update the customData field
        return await this.repository.update(id, {
            customData: {
                ...hotel.customData,
                ...customData
            }
        });
    }

    async deleteHotel(id: number) {
        const hotel = await this.repository.findById(id);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        return await this.repository.delete(id);
    }

    async searchHotels(query: string) {
        return await this.repository.searchHotels(query);
    }
}