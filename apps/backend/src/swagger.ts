import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flight Search API',
      version: '1.0.0',
      description: 'API documentation for the Flight Search application',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Flight: {
          type: 'object',
          properties: {
            flightNumber: { type: 'string' },
            departureStation: { type: 'string' },
            arrivalStation: { type: 'string' },
            departureDate: { type: 'string', format: 'date-time' },
            arrivalDate: { type: 'string', format: 'date-time' },
            bundle: { type: 'string', enum: ['basic', 'standard', 'plus'] },
            price: { type: 'number' },
            available: { type: 'boolean' },
          },
        },
        Station: {
          type: 'object',
          properties: {
            iata: { type: 'string' },
            name: { type: 'string' },
            country: { type: 'string' },
            city: { type: 'string' },
            connections: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        FlightFilters: {
          type: 'object',
          properties: {
            departureStation: { type: 'string' },
            arrivalStation: { type: 'string' },
            departureDate: { type: 'string' },
            bundle: { type: 'string', enum: ['basic', 'standard', 'plus'] },
            minPrice: { type: 'number' },
            maxPrice: { type: 'number' },
            availableOnly: { type: 'boolean' },
          },
        },
        StationFilters: {
          type: 'object',
          properties: {
            iata: { type: 'string' },
            name: { type: 'string' },
            hasConnection: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      responses: {
        FlightSearchResponse: {
          description: 'Flight search response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Flight' },
                  },
                  count: { type: 'number' },
                  filters: { $ref: '#/components/schemas/FlightFilters' },
                },
              },
            },
          },
        },
        StationSearchResponse: {
          description: 'Station search response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Station' },
                  },
                  count: { type: 'number' },
                  filters: { $ref: '#/components/schemas/StationFilters' },
                },
              },
            },
          },
        },
        SingleStationResponse: {
          description: 'Single station response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Station' },
                },
              },
            },
          },
        },
        ConnectionsResponse: {
          description: 'Station connections response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  count: { type: 'number' },
                  station: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Flights',
        description: 'Flight API endpoints',
      },
      {
        name: 'Stations',
        description: 'Station API endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
