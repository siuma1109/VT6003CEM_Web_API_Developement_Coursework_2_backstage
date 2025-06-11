import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Hotel Management API',
        version: '1.0.0',
        description: 'API documentation for Hotel Management System with Hotelbeds Integration',
    },
    servers: [
        {
            url: 'http://localhost:8081',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token in the format: Bearer <token>'
            },
        },
    },
    security: [{
        bearerAuth: [],
    }],
    paths: {
        '/api/v1/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password', 'name'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 6 },
                                    name: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                    },
                    400: {
                        description: 'Invalid input',
                    },
                },
            },
        },
        '/api/v1/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Invalid credentials',
                    },
                },
            },
        },
        '/api/v1/auth/check-email-exists': {
            post: {
                tags: ['Authentication'],
                summary: 'Check if an email exists in the system',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Email check completed',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                exists: { type: 'boolean' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Email is required'
                    },
                    500: {
                        description: 'Server error'
                    }
                }
            }
        },
        '/api/v1/hotels': {
            get: {
                tags: ['Hotels'],
                summary: 'Get all hotels',
                responses: {
                    200: {
                        description: 'List of hotels',
                    },
                },
            },
            post: {
                tags: ['Hotels'],
                summary: 'Create a new hotel',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'address'],
                                properties: {
                                    name: { type: 'string' },
                                    address: { type: 'string' },
                                    description: { type: 'string' },
                                    rating: { type: 'number', minimum: 1, maximum: 5 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Hotel created successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/api/v1/hotels/{id}': {
            get: {
                tags: ['Hotels'],
                summary: 'Get hotel by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Hotel details',
                    },
                    404: {
                        description: 'Hotel not found',
                    },
                },
            },
            put: {
                tags: ['Hotels'],
                summary: 'Update hotel',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    address: { type: 'string' },
                                    description: { type: 'string' },
                                    rating: { type: 'number', minimum: 1, maximum: 5 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Hotel updated successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Hotel not found',
                    },
                },
            },
            delete: {
                tags: ['Hotels'],
                summary: 'Delete hotel',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Hotel deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Hotel not found',
                    },
                },
            },
            '/api/v1/hotels/{hotelId}/chat-room': {
                get: {
                    tags: ['Chat Rooms'],
                    summary: 'Get or create a chat room for a hotel and user',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'hotelId',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            description: 'ID of the hotel'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Chat room retrieved or created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            message: { type: 'string' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    userId: { type: 'integer' },
                                                    hotelId: { type: 'integer' },
                                                    newMessageTime: { type: 'string', format: 'date-time' },
                                                    createdAt: { type: 'string', format: 'date-time' },
                                                    updatedAt: { type: 'string', format: 'date-time' },
                                                    hotel: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            name: { type: 'string' },
                                                            images: { type: 'array', items: { type: 'string' } }
                                                        }
                                                    },
                                                    user: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            name: { type: 'string' },
                                                            email: { type: 'string' },
                                                            avatar: { type: 'string' }
                                                        }
                                                    },
                                                    messages: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                id: { type: 'integer' },
                                                                content: { type: 'string' },
                                                                senderId: { type: 'integer' },
                                                                createdAt: { type: 'string', format: 'date-time' },
                                                                sender: {
                                                                    type: 'object',
                                                                    properties: {
                                                                        id: { type: 'integer' },
                                                                        name: { type: 'string' },
                                                                        email: { type: 'string' }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            description: 'Unauthorized - User not authenticated'
                        },
                        404: {
                            description: 'Chat room not found'
                        },
                        500: {
                            description: 'Server error'
                        }
                    }
                }
            }
        },
        '/api/v1/users': {
            get: {
                tags: ['Users'],
                summary: 'Get all users',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of users',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
            post: {
                tags: ['Users'],
                summary: 'Create a new user',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password', 'name'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 6 },
                                    name: { type: 'string' }
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User created successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
        },
        '/api/v1/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Get user by ID or get current user profile',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to get current user profile'
                    },
                ],
                responses: {
                    200: {
                        description: 'User details retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                                email: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized - User not authenticated'
                    },
                    404: {
                        description: 'User not found'
                    }
                }
            },
            put: {
                tags: ['Users'],
                summary: 'Update user by ID or update current user profile',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to update current user profile'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'User updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                                email: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized - User not authenticated'
                    },
                    404: {
                        description: 'User not found'
                    },
                    400: {
                        description: 'Invalid input data'
                    }
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete user',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'User deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                },
            },
        },
        '/api/v1/users/{id}/avatar': {
            post: {
                tags: ['Users'],
                summary: 'Upload user avatar',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to upload avatar for current user'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    avatar: {
                                        type: 'string',
                                        format: 'binary',
                                        description: 'Image file (JPEG, PNG, GIF, or WebP)'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Avatar uploaded successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                name: { type: 'string' },
                                                email: { type: 'string' },
                                                avatar: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid file type or size'
                    },
                    401: {
                        description: 'Unauthorized - User not authenticated'
                    },
                    404: {
                        description: 'User not found'
                    }
                }
            }
        },
        '/api/v1/users/{id}/favourites': {
            get: {
                tags: ['Users'],
                summary: 'Get user\'s favorite hotels',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to get current user\'s favorites'
                    }
                ],
                responses: {
                    200: {
                        description: 'List of favorite hotels',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    hotelId: { type: 'integer' },
                                                    hotel: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            name: { type: 'string' },
                                                            description: { type: 'string' },
                                                            address: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized - User not authenticated' },
                    404: { description: 'User not found' }
                }
            },
            post: {
                tags: ['Users'],
                summary: 'Add a hotel to user\'s favorites',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to add to current user\'s favorites'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['hotelId'],
                                properties: {
                                    hotelId: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Hotel added to favorites successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                userId: { type: 'integer' },
                                                hotelId: { type: 'integer' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Hotel already in favorites' },
                    401: { description: 'Unauthorized - User not authenticated' },
                    404: { description: 'Hotel not found' }
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Remove a hotel from user\'s favorites',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to remove from current user\'s favorites'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['hotelId'],
                                properties: {
                                    hotelId: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Hotel removed from favorites successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized - User not authenticated' },
                    404: { description: 'Favorite not found' }
                }
            }
        },
        '/api/v1/users/{id}/favourites/check': {
            get: {
                tags: ['Users'],
                summary: 'Check if a hotel is in user\'s favorites',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'User ID or "me" to check current user\'s favorites'
                    },
                    {
                        name: 'hotelId',
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'integer'
                        },
                        description: 'ID of the hotel to check'
                    }
                ],
                responses: {
                    200: {
                        description: 'Favorite status checked successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                isFavourite: { type: 'boolean' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized - User not authenticated' },
                    400: { description: 'Hotel ID is required' }
                }
            }
        },
        '/api/v1/hotel-beds/check-status': {
            get: {
                tags: ['Hotelbeds'],
                summary: 'Check Hotelbeds API status',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'API status information',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized - Admin access required'
                    },
                    403: {
                        description: 'Forbidden - Insufficient permissions'
                    }
                }
            }
        },
        '/api/v1/hotel-beds/search': {
            get: {
                tags: ['Hotelbeds'],
                summary: 'Search for hotels using Hotelbeds API',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'List of available hotels',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        hotels: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    code: { type: 'string' },
                                                    name: { type: 'string' },
                                                    category: { type: 'string' },
                                                    destination: { type: 'string' },
                                                    zone: { type: 'string' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized - Admin access required'
                    },
                    403: {
                        description: 'Forbidden - Insufficient permissions'
                    }
                }
            }
        },
        '/api/v1/hotel-beds/sync': {
            post: {
                tags: ['Hotelbeds'],
                summary: 'Sync hotels data from Hotelbeds API',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'number'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Hotels synchronized successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        count: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized - Admin access required'
                    },
                    403: {
                        description: 'Forbidden - Insufficient permissions'
                    },
                    500: {
                        description: 'Internal server error'
                    }
                }
            }
        },
        '/api/v1/sign-up-codes': {
            get: {
                tags: ['Sign-up Codes'],
                summary: 'Get all sign-up codes',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of sign-up codes',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/SignUpCode'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized'
                    },
                    403: {
                        description: 'Forbidden - Admin access required'
                    }
                }
            }
        },
        '/api/v1/sign-up-codes/generate': {
            post: {
                tags: ['Sign-up Codes'],
                summary: 'Generate a new sign-up code',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['roleId'],
                                properties: {
                                    roleId: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Sign-up code generated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            $ref: '#/components/schemas/SignUpCode'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid input'
                    },
                    401: {
                        description: 'Unauthorized'
                    },
                    403: {
                        description: 'Forbidden - Admin access required'
                    }
                }
            }
        },
        '/api/v1/sign-up-codes/validate': {
            post: {
                tags: ['Sign-up Codes'],
                summary: 'Validate a sign-up code',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['code'],
                                properties: {
                                    code: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Code is valid',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            $ref: '#/components/schemas/SignUpCode'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid or expired code'
                    }
                }
            }
        },
        '/api/v1/sign-up-codes/{id}': {
            delete: {
                tags: ['Sign-up Codes'],
                summary: 'Delete a sign-up code',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID of the sign-up code to delete'
                    }
                ],
                responses: {
                    200: {
                        description: 'Sign-up code deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Code ID is required' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden - Admin access required' },
                    404: { description: 'Sign-up code not found' }
                }
            }
        },
        '/api/v1/roles': {
            get: {
                tags: ['Roles'],
                summary: 'Get all roles',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of roles',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'number' },
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Role' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden - Admin access required' }
                }
            },
            post: {
                tags: ['Roles'],
                summary: 'Create a new role',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Role created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'number' },
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: { $ref: '#/components/schemas/Role' }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Bad request - Role name already exists' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden - Admin access required' }
                }
            }
        },
        '/api/v1/roles/{id}': {
            get: {
                tags: ['Roles'],
                summary: 'Get role by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Role details',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'number' },
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: { $ref: '#/components/schemas/Role' }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden - Admin access required' },
                    404: { description: 'Role not found' }
                }
            },
            put: {
                tags: ['Roles'],
                summary: 'Update a role',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Role updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'number' },
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: { $ref: '#/components/schemas/Role' }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Bad request - Role name already exists' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden - Admin access required' },
                    404: { description: 'Role not found' }
                }
            },
            delete: {
                tags: ['Roles'],
                summary: 'Delete a role',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Role deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'number' },
                                        success: { type: 'boolean' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Bad request - Cannot delete system roles' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden - Admin access required' },
                    404: { description: 'Role not found' }
                }
            }
        },
        '/api/v1/chat-rooms': {
            get: {
                tags: ['Chat Rooms'],
                summary: 'Get all chat rooms',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', default: 1 }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', default: 10 }
                    },
                    {
                        name: 'search',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'List of chat rooms',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        paginate: {
                                            type: 'object',
                                            properties: {
                                                total: { type: 'integer' },
                                                page: { type: 'integer' },
                                                limit: { type: 'integer' },
                                                totalPages: { type: 'integer' }
                                            }
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    userId: { type: 'integer' },
                                                    hotelId: { type: 'integer' },
                                                    newMessageTime: { type: 'string', format: 'date-time' },
                                                    createdAt: { type: 'string', format: 'date-time' },
                                                    updatedAt: { type: 'string', format: 'date-time' },
                                                    hotel: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            name: { type: 'string' }
                                                        }
                                                    },
                                                    user: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            name: { type: 'string' },
                                                            email: { type: 'string' }
                                                        }
                                                    },
                                                    messages: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                id: { type: 'integer' },
                                                                content: { type: 'string' },
                                                                senderId: { type: 'integer' },
                                                                createdAt: { type: 'string', format: 'date-time' },
                                                                sender: {
                                                                    type: 'object',
                                                                    properties: {
                                                                        id: { type: 'integer' },
                                                                        name: { type: 'string' },
                                                                        email: { type: 'string' }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' }
                }
            },
            post: {
                tags: ['Chat Rooms'],
                summary: 'Create a new chat room',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['hotelId'],
                                properties: {
                                    hotelId: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Chat room created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                userId: { type: 'integer' },
                                                hotelId: { type: 'integer' },
                                                newMessageTime: { type: 'string', format: 'date-time' },
                                                createdAt: { type: 'string', format: 'date-time' },
                                                updatedAt: { type: 'string', format: 'date-time' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Bad request' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/api/v1/chat-rooms/{id}': {
            get: {
                tags: ['Chat Rooms'],
                summary: 'Get chat room by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Chat room details',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                userId: { type: 'integer' },
                                                hotelId: { type: 'integer' },
                                                newMessageTime: { type: 'string', format: 'date-time' },
                                                createdAt: { type: 'string', format: 'date-time' },
                                                updatedAt: { type: 'string', format: 'date-time' },
                                                hotel: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        images: { type: 'array', items: { type: 'string' } }
                                                    }
                                                },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        email: { type: 'string' },
                                                        avatar: { type: 'string' }
                                                    }
                                                },
                                                messages: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            content: { type: 'string' },
                                                            senderId: { type: 'integer' },
                                                            createdAt: { type: 'string', format: 'date-time' },
                                                            sender: {
                                                                type: 'object',
                                                                properties: {
                                                                    id: { type: 'integer' },
                                                                    name: { type: 'string' },
                                                                    email: { type: 'string' }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    404: { description: 'Chat room not found' }
                }
            },
            put: {
                tags: ['Chat Rooms'],
                summary: 'Update chat room',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    hotelId: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Chat room updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                userId: { type: 'integer' },
                                                hotelId: { type: 'integer' },
                                                newMessageTime: { type: 'string', format: 'date-time' },
                                                createdAt: { type: 'string', format: 'date-time' },
                                                updatedAt: { type: 'string', format: 'date-time' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Bad request' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden' },
                    404: { description: 'Chat room not found' }
                }
            },
            delete: {
                tags: ['Chat Rooms'],
                summary: 'Delete chat room',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Chat room deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Forbidden' },
                    404: { description: 'Chat room not found' }
                }
            }
        },
        '/api/v1/chat-rooms/{id}/messages': {
            get: {
                tags: ['Chat Rooms'],
                summary: 'Get messages from a chat room',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    },
                    {
                        name: 'page',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', default: 1 }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', default: 10 }
                    }
                ],
                responses: {
                    200: {
                        description: 'List of messages',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        paginate: {
                                            type: 'object',
                                            properties: {
                                                total: { type: 'integer' },
                                                page: { type: 'integer' },
                                                limit: { type: 'integer' },
                                                totalPages: { type: 'integer' }
                                            }
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    content: { type: 'string' },
                                                    senderId: { type: 'integer' },
                                                    chatRoomId: { type: 'integer' },
                                                    isDeleted: { type: 'boolean' },
                                                    createdAt: { type: 'string', format: 'date-time' },
                                                    updatedAt: { type: 'string', format: 'date-time' },
                                                    sender: {
                                                        type: 'object',
                                                        properties: {
                                                            id: { type: 'integer' },
                                                            name: { type: 'string' },
                                                            email: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    404: { description: 'Chat room not found' }
                }
            },
            post: {
                tags: ['Chat Rooms'],
                summary: 'Create a new message in a chat room',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Message created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                content: { type: 'string' },
                                                senderId: { type: 'integer' },
                                                chatRoomId: { type: 'integer' },
                                                isDeleted: { type: 'boolean' },
                                                createdAt: { type: 'string', format: 'date-time' },
                                                updatedAt: { type: 'string', format: 'date-time' },
                                                sender: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        email: { type: 'string' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: 'Bad request' },
                    401: { description: 'Unauthorized' },
                    404: { description: 'Chat room not found' }
                }
            }
        }
    }
};

export const swaggerOptions: SwaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ['./src/routes/*.ts'],
}; 