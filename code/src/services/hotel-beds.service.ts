import { HttpService } from './http.service';
import * as crypto from 'crypto';
import { Hotel } from '../models/hotel.model';

interface HotelBedsSearchParams {
    checkIn: string;
    checkOut: string;
    destinationCode?: string;
    adults?: number;
    children?: number;
    rooms?: number;
    page?: number;
    limit?: number;
}

interface HotelBedsResponse {
    // Add appropriate types based on Hotelbeds API response
    hotels: any[];
    total: number;
}

export const HotelBedsService = {
    async checkStatus(): Promise<any> {
        const httpService = HttpService.getInstance();
        const baseUrl = process.env.HOTELBEDS_BASE_URL || 'https://api.test.hotelbeds.com';
        const apiKey = process.env.HOTELBEDS_API_KEY;
        const secret = process.env.HOTELBEDS_SECRET;

        if (!apiKey || !secret) {
            throw new Error('Missing Hotelbeds API credentials');
        }

        // Generate signature as per bash script
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureString = `${apiKey}${secret}${timestamp}`;
        const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

        const headers = {
            'Accept': 'application/json',
            'Api-Key': apiKey,
            'X-Signature': signature
        };
        const url = `${baseUrl}/hotel-api/1.0/status`;
        console.log('url: ', url);
        console.log('headers: ', headers);
        return httpService.get(url, { headers });
    },

    async searchHotels(params: HotelBedsSearchParams): Promise<HotelBedsResponse> {
        const httpService = HttpService.getInstance();
        const baseUrl = process.env.HOTELBEDS_BASE_URL || 'https://api.test.hotelbeds.com';
        const apiKey = process.env.HOTELBEDS_API_KEY;
        const secret = process.env.HOTELBEDS_SECRET;

        if (!apiKey || !secret) {
            throw new Error('Missing Hotelbeds API credentials');
        }

        // Generate signature as per documentation
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureString = `${apiKey}${secret}${timestamp}`;
        const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

        const headers = {
            'Api-Key': apiKey,
            'X-Signature': signature,
            'Accept': 'application/json'
        };

        // Build query parameters only for provided values
        const queryParams = new URLSearchParams();
        
        // Add parameters only if they exist
        if (params.checkIn) queryParams.append('checkIn', params.checkIn);
        if (params.checkOut) queryParams.append('checkOut', params.checkOut);
        if (params.adults) queryParams.append('adults', params.adults.toString());
        if (params.children) queryParams.append('children', params.children.toString());
        if (params.rooms) queryParams.append('rooms', params.rooms.toString());
        if (params.destinationCode) queryParams.append('destinationCode', params.destinationCode);
        
        // Calculate pagination
        const limit = params.limit || 10;
        let from = 1;
        let to = limit;
        
        if (params.page) {
            from = (params.page - 1) * limit + 1;
            to = params.page * limit;
        }

        // Add required parameters for the API
        queryParams.append('fields', 'all');
        queryParams.append('language', 'ENG');
        queryParams.append('useSecondaryLanguage', 'false');
        queryParams.append('from', `${from}`);
        queryParams.append('to', `${to}`);

        const url = `${baseUrl}/hotel-content-api/1.0/hotels?${queryParams.toString()}`;
        console.log('Search URL:', url);
        return httpService.get(url, { headers });
    },

    async syncHotels(page: number = 1, limit: number = 10): Promise<{ synced: number; errors: number }> {
        try {
            const response = await this.searchHotels({
                checkIn: new Date().toISOString().split('T')[0],
                checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                page,
                limit
            });

            const hotels = response.hotels;
            let synced = 0;
            let errors = 0;

            for (const hotelData of hotels) {
                try {
                    const [hotel, created] = await Hotel.findOrCreate({
                        where: { hotelBedsId: hotelData.code },
                        defaults: {
                            hotelBedsId: hotelData.code,
                            name: hotelData.name?.content || '',
                            description: hotelData.description?.content || '',
                            address: hotelData.address?.content || '',
                            postalCode: hotelData.postalCode || '',
                            email: hotelData.email || 'no-email@example.com', // Default email if not provided
                            phones: hotelData.phones?.map((phone: any) => ({
                                phoneNumber: phone.phoneNumber,
                                phoneType: phone.phoneType
                            })) || [],
                            city: hotelData.city?.content || '',
                            countryCode: hotelData.countryCode || '',
                            stateCode: hotelData.stateCode || '',
                            destinationCode: hotelData.destinationCode || '',
                            zoneCode: hotelData.zoneCode ? String(hotelData.zoneCode) : '',
                            latitude: hotelData.coordinates?.latitude,
                            longitude: hotelData.coordinates?.longitude,
                            category: hotelData.categoryCode,
                            images: hotelData.images?.map((img: any) => img.path) || [],
                            status: 'pending',
                            lastUpdated: new Date()
                        }
                    });

                    if (!created) {
                        await hotel.update({
                            name: hotelData.name?.content || hotel.name,
                            description: hotelData.description?.content || hotel.description,
                            address: hotelData.address?.content || hotel.address,
                            postalCode: hotelData.postalCode || hotel.postalCode,
                            email: hotelData.email || hotel.email,
                            phones: hotelData.phones?.map((phone: any) => ({
                                phoneNumber: phone.phoneNumber,
                                phoneType: phone.phoneType
                            })) || hotel.phones,
                            city: hotelData.city?.content || hotel.city,
                            countryCode: hotelData.countryCode || hotel.countryCode,
                            stateCode: hotelData.stateCode || hotel.stateCode,
                            destinationCode: hotelData.destinationCode || hotel.destinationCode,
                            zoneCode: hotelData.zoneCode ? String(hotelData.zoneCode) : hotel.zoneCode,
                            latitude: hotelData.coordinates?.latitude || hotel.latitude,
                            longitude: hotelData.coordinates?.longitude || hotel.longitude,
                            category: hotelData.categoryCode || hotel.category,
                            images: hotelData.images?.map((img: any) => img.path) || hotel.images,
                            lastUpdated: new Date()
                        });
                    }

                    synced++;
                } catch (error) {
                    console.error(`Error syncing hotel ${hotelData.code}:`, error);
                    errors++;
                }
            }

            return { synced, errors };
        } catch (error) {
            console.error('Error in syncHotels:', error);
            throw error;
        }
    }
};