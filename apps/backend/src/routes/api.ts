import { Router, Request, Response } from 'express';
import { FlightRepository, StationRepository } from '../repositories';
import { 
  FlightFilters, 
  StationFilters,
  FlightSearchResponse,
  StationSearchResponse,
  SingleStationResponse,
  ConnectionsResponse,
  ErrorResponse
} from '@mito-test/shared-types';

const router = Router();
const flightRepository = new FlightRepository();
const stationRepository = new StationRepository();

// Flight endpoints
router.get('/flights', (req: Request, res: Response<FlightSearchResponse | ErrorResponse>) => {
  try {
    const filters: FlightFilters = {
      departureStation: req.query.departureStation as string,
      arrivalStation: req.query.arrivalStation as string,
      departureDate: req.query.departureDate as string,
      bundle: req.query.bundle as 'basic' | 'standard' | 'plus',
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      availableOnly: req.query.availableOnly === 'true'
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof FlightFilters] === undefined && delete filters[key as keyof FlightFilters]
    );

    const flights = flightRepository.findAll(filters);
    
    res.json({
      data: flights,
      count: flights.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch flights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/flights/route/:departure/:arrival', (req: Request, res: Response<FlightSearchResponse | ErrorResponse>) => {
  try {
    const { departure, arrival } = req.params;
    const flights = flightRepository.findByRoute(departure, arrival);
    
    res.json({
      data: flights,
      count: flights.length,
      route: `${departure} → ${arrival}`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch flights for route',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/flights/station/:station', (req: Request, res: Response<FlightSearchResponse | ErrorResponse>) => {
  try {
    const { station } = req.params;
    const flights = flightRepository.findByStation(station);
    
    res.json({
      data: flights,
      count: flights.length,
      station: station
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch flights for station',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Station endpoints
router.get('/stations', (req: Request, res: Response<StationSearchResponse | ErrorResponse>) => {
  try {
    const filters: StationFilters = {
      iata: req.query.iata as string,
      name: req.query.name as string,
      hasConnection: req.query.hasConnection as string
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof StationFilters] === undefined && delete filters[key as keyof StationFilters]
    );

    const stations = stationRepository.findAll(filters);
    
    res.json({
      data: stations,
      count: stations.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch stations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/stations/:iata', (req: Request, res: Response<SingleStationResponse | ErrorResponse>) => {
  try {
    const { iata } = req.params;
    const station = stationRepository.findByIata(iata);
    
    if (!station) {
      return res.status(404).json({
        error: 'Station not found',
        message: `No station found with IATA code: ${iata}`
      });
    }
    
    res.json({
      data: station
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch station',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/stations/:iata/connections', (req: Request, res: Response<ConnectionsResponse | ErrorResponse>) => {
  try {
    const { iata } = req.params;
    const connections = stationRepository.findConnections(iata);
    
    if (connections.length === 0) {
      return res.status(404).json({
        error: 'Station not found or no connections',
        message: `No connections found for station: ${iata}`
      });
    }
    
    res.json({
      data: connections,
      count: connections.length,
      station: iata
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch station connections',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/stations/search/:name', (req: Request, res: Response<StationSearchResponse | ErrorResponse>) => {
  try {
    const { name } = req.params;
    const stations = stationRepository.searchByName(name);
    
    res.json({
      data: stations,
      count: stations.length,
      searchTerm: name
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to search stations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
