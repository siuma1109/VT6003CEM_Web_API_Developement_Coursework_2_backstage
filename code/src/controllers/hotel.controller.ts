import { Request, Response } from 'express';
import { HotelService } from '../services/hotel.service';
import { apiResponse } from '../utils/api-response.util';

export class HotelController {
    private service: HotelService;

    constructor() {
        this.service = new HotelService();
    }

    getAllHotels = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.service.getAllHotels(page, limit);
            apiResponse(res, 200, 'Hotels retrieved successfully', result.paginate, result.data);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving hotels', undefined, undefined, error.message);
        }
    };

    getHotelById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const hotel = await this.service.getHotelById(id);
            
            if (!hotel) {
                apiResponse(res, 404, 'Hotel not found');
                return;
            }

            apiResponse(res, 200, 'Hotel retrieved successfully', undefined, hotel);
        } catch (error: any) {
            apiResponse(res, 500, 'Error retrieving hotel', undefined, undefined, error.message);
        }
    };

    createHotel = async (req: Request, res: Response): Promise<void> => {
        try {
            const hotel = await this.service.createHotel(req.body);
            apiResponse(res, 201, 'Hotel created successfully', undefined, hotel);
        } catch (error: any) {
            apiResponse(res, 400, 'Error creating hotel', undefined, undefined, error.message);
        }
    };

    updateHotel = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const hotel = await this.service.updateHotel(id, req.body);
            
            if (!hotel) {
                apiResponse(res, 404, 'Hotel not found');
                return;
            }

            apiResponse(res, 200, 'Hotel updated successfully', undefined, hotel);
        } catch (error: any) {
            apiResponse(res, 400, 'Error updating hotel', undefined, undefined, error.message);
        }
    };

    deleteHotel = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const success = await this.service.deleteHotel(id);
            
            if (!success) {
                apiResponse(res, 404, 'Hotel not found');
                return;
            }

            apiResponse(res, 200, 'Hotel deleted successfully');
        } catch (error: any) {
            apiResponse(res, 400, 'Error deleting hotel', undefined, undefined, error.message);
        }
    };

    searchHotels = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                apiResponse(res, 400, 'Search query is required');
                return;
            }

            const hotels = await this.service.searchHotels(query);
            apiResponse(res, 200, 'Hotels search completed', undefined, hotels);
        } catch (error: any) {
            apiResponse(res, 500, 'Error searching hotels', undefined, undefined, error.message);
        }
    };
} 