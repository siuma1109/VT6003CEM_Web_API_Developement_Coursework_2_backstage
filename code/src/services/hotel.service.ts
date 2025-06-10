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
        if (!hotelData.name || !hotelData.email) {
            throw new Error('Missing required fields: name, and email are required');
        }

        // Check if hotel with same hotelBedsId already exists
        if (hotelData.hotelBedsId) {
            const existingHotel = await this.repository.findByHotelBedsId(hotelData.hotelBedsId);
            if (existingHotel) {
                throw new Error('Hotel with this HotelBeds ID already exists');
            }
        }

        return await this.repository.create(hotelData);
    }

    async updateHotel(id: number, updateData: Partial<Hotel>) {
        const hotel = await this.repository.findById(id);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        // If hotelBedsId is null, allow full field updates
        if (!hotel.hotelBedsId) {
            return await this.repository.update(id, updateData);
        }

        // For hotels synced with HotelBeds, only allow status and customData updates
        const updateFields: any = {};
        
        // Only allow status update if provided
        if (updateData.status) {
            updateFields.status = updateData.status;
        }

        // Only allow customData update if provided
        if (updateData.customData) {
            updateFields.customData = {
                ...hotel.customData,
                ...updateData.customData
            };
        }

        return await this.repository.update(id, updateFields);
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