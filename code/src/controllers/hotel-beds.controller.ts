import { Request, Response } from "express";
import { HotelBedsService } from "../services/hotel-beds.service";

export class HotelBedsController {
    static async checkStatus(req: Request, res:Response) {
        try {
            const response = await HotelBedsService.checkStatus();
            res.json(response);
        } catch (error) {
            console.error('Error fetching status:', error);
            res.status(500).json({
                error: 'Failed to fetch status',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    static async getHotelsResoruces(req: Request, res: Response) {
        try {
            const { checkIn, checkOut, destinationCode, adults, children, rooms, page, limit } = req.query;

            const response = await HotelBedsService.searchHotels({
                checkIn: checkIn as string,
                checkOut: checkOut as string,
                destinationCode: destinationCode as string,
                adults: adults ? parseInt(adults as string) : undefined,
                children: children ? parseInt(children as string) : undefined,
                rooms: rooms ? parseInt(rooms as string) : undefined,
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            });

            res.json(response);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).json({
                error: 'Failed to fetch hotels',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    static async syncHotels(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await HotelBedsService.syncHotels(page, limit);
            
            res.json({
                success: true,
                message: `Successfully synced ${result.synced} hotels with ${result.errors} errors`,
                data: result
            });
        } catch (error) {
            console.error('Error in syncHotels controller:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to sync hotels',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}