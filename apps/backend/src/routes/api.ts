import { Router, Request, Response } from 'express';
import { FlightRepository, StationRepository } from '../repositories';
import {
  FlightFilters,
  StationFilters,
  FlightSearchResponse,
  StationSearchResponse,
  SingleStationResponse,
  ConnectionsResponse,
  ErrorResponse,
} from '@mito-test/shared-types';

const router = Router();
const flightRepository = new FlightRepository();
const stationRepository = new StationRepository();

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Get all flights with optional filtering
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: departureStation
 *         schema:
 *           type: string
 *         description: IATA code of departure station
 *       - in: query
 *         name: arrivalStation
 *         schema:
 *           type: string
 *         description: IATA code of arrival station
 *       - in: query
 *         name: departureDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date (YYYY-MM-DD)
 *       - in: query
 *         name: bundle
 *         schema:
 *           type: string
 *           enum: [basic, standard, plus]
 *         description: Flight bundle type
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *         description: Filter for available flights only
 *     responses:
 *       200:
 *         description: List of flights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 *                 count:
 *                   type: integer
 *                 filters:
 *                   $ref: '#/components/schemas/FlightFilters'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/flights',
  (req: Request, res: Response<FlightSearchResponse | ErrorResponse>) => {
    try {
      const filters: FlightFilters = {
        departureStation: req.query.departureStation as string,
        arrivalStation: req.query.arrivalStation as string,
        departureDate: req.query.departureDate as string,
        bundle: req.query.bundle as 'basic' | 'standard' | 'plus',
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        availableOnly: req.query.availableOnly === 'true',
      };

      // Remove undefined values
      Object.keys(filters).forEach(
        (key) =>
          filters[key as keyof FlightFilters] === undefined &&
          delete filters[key as keyof FlightFilters]
      );

      const flights = flightRepository.findAll(filters);

      res.json({
        data: flights,
        count: flights.length,
        filters: filters,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch flights',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * @swagger
 * /api/flights/route/{departure}/{arrival}:
 *   get:
 *     summary: Get flights by route (departure and arrival stations)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: departure
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA code of departure station
 *       - in: path
 *         name: arrival
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA code of arrival station
 *     responses:
 *       200:
 *         description: List of flights for the specified route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 *                 count:
 *                   type: integer
 *                 route:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/flights/route/:departure/:arrival',
  (req: Request, res: Response<FlightSearchResponse | ErrorResponse>) => {
    try {
      const { departure, arrival } = req.params;
      const flights = flightRepository.findByRoute(departure, arrival);

      res.json({
        data: flights,
        count: flights.length,
        route: `${departure} → ${arrival}`,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch flights for route',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * @swagger
 * /api/flights/station/{station}:
 *   get:
 *     summary: Get flights by station (departure or arrival)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: station
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA code of the station
 *     responses:
 *       200:
 *         description: List of flights for the specified station
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 *                 count:
 *                   type: integer
 *                 station:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/flights/station/:station',
  (req: Request, res: Response<FlightSearchResponse | ErrorResponse>) => {
    try {
      const { station } = req.params;
      const flights = flightRepository.findByStation(station);

      res.json({
        data: flights,
        count: flights.length,
        station: station,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch flights for station',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all stations with optional filtering
 *     tags: [Stations]
 *     parameters:
 *       - in: query
 *         name: iata
 *         schema:
 *           type: string
 *         description: IATA code filter
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Station name filter
 *       - in: query
 *         name: hasConnection
 *         schema:
 *           type: string
 *         description: Filter by connection to this IATA code
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Station'
 *                 count:
 *                   type: integer
 *                 filters:
 *                   $ref: '#/components/schemas/StationFilters'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stations',
  (req: Request, res: Response<StationSearchResponse | ErrorResponse>) => {
    try {
      const filters: StationFilters = {
        iata: req.query.iata as string,
        name: req.query.name as string,
        hasConnection: req.query.hasConnection as string,
      };

      // Remove undefined values
      Object.keys(filters).forEach(
        (key) =>
          filters[key as keyof StationFilters] === undefined &&
          delete filters[key as keyof StationFilters]
      );

      const stations = stationRepository.findAll(filters);

      res.json({
        data: stations,
        count: stations.length,
        filters: filters,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch stations',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * @swagger
 * /api/stations/{iata}:
 *   get:
 *     summary: Get a station by IATA code
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: iata
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA code of the station
 *     responses:
 *       200:
 *         description: Station details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stations/:iata',
  (req: Request, res: Response<SingleStationResponse | ErrorResponse>) => {
    try {
      const { iata } = req.params;
      const station = stationRepository.findByIata(iata);

      if (!station) {
        return res.status(404).json({
          error: 'Station not found',
          message: `No station found with IATA code: ${iata}`,
        });
      }

      res.json({
        data: station,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch station',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * @swagger
 * /api/stations/{iata}/connections:
 *   get:
 *     summary: Get all connections for a station
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: iata
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA code of the station
 *     responses:
 *       200:
 *         description: List of connected stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 count:
 *                   type: integer
 *                 station:
 *                   type: string
 *       404:
 *         description: Station not found or no connections
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stations/:iata/connections',
  (req: Request, res: Response<ConnectionsResponse | ErrorResponse>) => {
    try {
      const { iata } = req.params;
      const connections = stationRepository.findConnections(iata);

      if (connections.length === 0) {
        return res.status(404).json({
          error: 'Station not found or no connections',
          message: `No connections found for station: ${iata}`,
        });
      }

      res.json({
        data: connections,
        count: connections.length,
        station: iata,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch station connections',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * @swagger
 * /api/stations/search/{name}:
 *   get:
 *     summary: Search stations by name
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name or partial name to search for
 *     responses:
 *       200:
 *         description: List of matching stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Station'
 *                 count:
 *                   type: integer
 *                 searchTerm:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/stations/search/:name',
  (req: Request, res: Response<StationSearchResponse | ErrorResponse>) => {
    try {
      const { name } = req.params;
      const stations = stationRepository.searchByName(name);

      res.json({
        data: stations,
        count: stations.length,
        searchTerm: name,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to search stations',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;
