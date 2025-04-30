export interface Country {
  code: string;
  name: string;
  geometry: any; // GeoJSON geometry
  provinces?: Province[];
}

export interface Province {
  code: string;
  name: string;
  geometry: any; // GeoJSON geometry
  countryCode: string;
}

export interface MapState {
  worldMap: {
    countries: Country[];
    loading: boolean;
    error: string | null;
  };
  selectedCountry: {
    country: Country | null;
    loading: boolean;
    error: string | null;
  };
  selectedProvince: {
    province: Province | null;
    loading: boolean;
    error: string | null;
  };
}
