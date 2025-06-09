import { Model, FindAndCountOptions, ModelStatic, Attributes } from '@sequelize/core';

export interface PaginatedResult<T> {
    paginate: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    data: T[];
}

export const paginate = async <T extends Model>(
    model: ModelStatic<T>,
    page: number,
    limit: number,
    options: Omit<FindAndCountOptions<Attributes<T>>, 'offset' | 'limit'> = {}
): Promise<PaginatedResult<T>> => {
    const offset = (page - 1) * limit;
    const { count, rows } = await model.findAndCountAll({
        offset,
        limit,
        ...options
    });

    return {
        paginate: {
            total: count,
            per_page: limit,
            current_page: page,
            last_page: Math.ceil(count / limit)
        },
        data: rows
    };
};

export const handleException = (error: any) => {
    let errors = [];

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        errors = error.errors.reduce((acc: any, curr: any) => {
            const cleanMessage = curr.message.replace(/^[^.]+\./, '');
            acc[curr.path] = cleanMessage;
            return acc;
        }, {});
    }

    const message = Object.values(errors).join(', ');

    return {
        message,
        errors
    };
}