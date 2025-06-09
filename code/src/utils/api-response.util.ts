import { Model } from "@sequelize/core";
import { Response } from "express";

export const apiResponse = (
    res: Response,
    status: number,
    message?: string,
    paginate?: {
        total: number,
        per_page: number,
        current_page: number,
        last_page: number,
    },
    data?: Model[] | Model | Object,
    errors?: Map<String, any>,
    metaData?: Map<String, any>
): Response => {
    let result = new Map<string, any>();
    result.set('status', status);
    result.set('success', status < 300);
    result.set('message', message);

    if (paginate) {
        result.set('paginate', {
            total: paginate.total,
            per_page: paginate.per_page,
            current_page: paginate.current_page,
            last_page: paginate.last_page,
        });
    }

    if (data) {
        result.set('data', data);
    }

    if(errors) {
        result.set('errors', errors);
    }

    if(metaData) {
        result.set('metaData', Object.fromEntries(metaData));
    }

    return res.status(status).json(Object.fromEntries(result));
};

