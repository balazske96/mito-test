// Base types
export interface Price {
  amount: number;
  currencyCode: string;
}

export interface Fare {
  price: Price;
  remainingTickets: number;
  bundle: 'basic' | 'standard' | 'plus';
}

export interface Flight {
  departureStation: string;
  arrivalStation: string;
  departureDateTime: string;
  arrivalDateTime: string;
  fares: Fare[];
}

export interface Station {
  iata: string;
  shortName: string;
  connections: string[];
}

// Filter types for API queries
export interface FlightFilters {
  departureStation?: string;
  arrivalStation?: string;
  departureDate?: string;
  maxPrice?: number;
  minPrice?: number;
  bundle?: 'basic' | 'standard' | 'plus';
  availableOnly?: boolean;
}

export interface StationFilters {
  iata?: string;
  name?: string;
  hasConnection?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  count?: number;
  filters?: Record<string, any>;
  message?: string;
}

export interface FlightSearchResponse extends ApiResponse<Flight[]> {
  filters?: FlightFilters;
  route?: string;
  station?: string;
}

export interface StationSearchResponse extends ApiResponse<Station[]> {
  filters?: StationFilters;
  searchTerm?: string;
}

export interface SingleStationResponse extends ApiResponse<Station> {}

export interface ConnectionsResponse extends ApiResponse<string[]> {
  station: string;
}

// Error response type
export interface ErrorResponse {
  error: string;
  message?: string;
  path?: string;
  method?: string;
}

// Utility types
export type BundleType = 'basic' | 'standard' | 'plus';

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: 'price' | 'departureTime' | 'arrivalTime' | 'duration';
  order: SortOrder;
}

// Frontend-specific types
export interface FlightSearchParams extends FlightFilters {
  sort?: SortOptions;
  page?: number;
  limit?: number;
}

// Computed/derived types for frontend use
export interface FlightWithDuration extends Flight {
  duration: number; // in minutes
  minPrice: number;
  maxPrice: number;
  availableBundles: BundleType[];
}

export interface StationWithFlightCount extends Station {
  departureCount: number;
  arrivalCount: number;
  totalFlights: number;
}
