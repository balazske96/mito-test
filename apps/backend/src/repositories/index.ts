import { 
  Flight, 
  Station, 
  FlightFilters, 
  StationFilters 
} from '@mito-test/shared-types';
import flightsBudLtn from '../data/flights-bud-ltn.json';
import flightsLtnBud from '../data/flights-ltn-bud.json';
import stationsData from '../data/stations.json';

export class FlightRepository {
  private readonly flights: Flight[];

  constructor() {
    // Combine all flight data
    this.flights = [
      ...(flightsBudLtn as Flight[]),
      ...(flightsLtnBud as Flight[])
    ];
  }

  findAll(filters?: FlightFilters): Flight[] {
    let result = this.flights;

    if (!filters) {
      return result;
    }

    if (filters.departureStation) {
      result = result.filter(flight => 
        flight.departureStation.toLowerCase() === filters.departureStation!.toLowerCase()
      );
    }

    if (filters.arrivalStation) {
      result = result.filter(flight => 
        flight.arrivalStation.toLowerCase() === filters.arrivalStation!.toLowerCase()
      );
    }

    if (filters.departureDate) {
      result = result.filter(flight => 
        flight.departureDateTime.startsWith(filters.departureDate!)
      );
    }

    if (filters.bundle) {
      result = result.filter(flight => 
        flight.fares.some(fare => fare.bundle === filters.bundle)
      );
    }

    if (filters.availableOnly) {
      result = result.filter(flight => 
        flight.fares.some(fare => fare.remainingTickets > 0)
      );
    }

    if (filters.minPrice || filters.maxPrice) {
      result = result.filter(flight => {
        const prices = flight.fares.map(fare => fare.price.amount);
        const minFlightPrice = Math.min(...prices);
        const maxFlightPrice = Math.max(...prices);

        if (filters.minPrice && minFlightPrice < filters.minPrice) return false;
        if (filters.maxPrice && maxFlightPrice > filters.maxPrice) return false;
        
        return true;
      });
    }

    return result;
  }

  findByRoute(departure: string, arrival: string): Flight[] {
    return this.flights.filter(flight => 
      flight.departureStation.toLowerCase() === departure.toLowerCase() &&
      flight.arrivalStation.toLowerCase() === arrival.toLowerCase()
    );
  }

  findByStation(station: string): Flight[] {
    return this.flights.filter(flight => 
      flight.departureStation.toLowerCase() === station.toLowerCase() ||
      flight.arrivalStation.toLowerCase() === station.toLowerCase()
    );
  }
}

export class StationRepository {
  private stations: Station[];

  constructor() {
    this.stations = stationsData as Station[];
  }

  findAll(filters?: StationFilters): Station[] {
    let result = this.stations;

    if (!filters) {
      return result;
    }

    if (filters.iata) {
      result = result.filter(station => 
        station.iata.toLowerCase() === filters.iata!.toLowerCase()
      );
    }

    if (filters.name) {
      result = result.filter(station => 
        station.shortName.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters.hasConnection) {
      result = result.filter(station => 
        station.connections.some(conn => 
          conn.toLowerCase() === filters.hasConnection!.toLowerCase()
        )
      );
    }

    return result;
  }

  findByIata(iata: string): Station | undefined {
    return this.stations.find(station => 
      station.iata.toLowerCase() === iata.toLowerCase()
    );
  }

  findConnections(iata: string): string[] {
    const station = this.findByIata(iata);
    return station ? station.connections : [];
  }

  searchByName(name: string): Station[] {
    return this.stations.filter(station => 
      station.shortName.toLowerCase().includes(name.toLowerCase())
    );
  }
}
