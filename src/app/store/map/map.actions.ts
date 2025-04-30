import { createAction, props } from '@ngrx/store';
import { Country, Province } from '../models/map.models';
import { FeatureCollection, Geometry } from 'geojson';
//import { MapError } from './map.effects';

export const loadWorldMap = createAction('[Map] Load World Map');

export const loadWorldMapSuccess = createAction(
  '[Map] Load World Map Success',
  props<{ countries: Country[] }>()
);

export const loadWorldMapFailure = createAction(
  '[Map] Load World Map Failure',
  props<{ error: string }>()
);

export const selectCountry = createAction(
  '[Map] Select Country',
  props<{ countryCode: string }>()
);

export const loadCountryMap = createAction(
  '[Map] Load Country Map',
  props<{ countryCode: string }>()
);

export const loadCountryMapSuccess = createAction(
  '[Map] Load Country Map Success',
  props<{ country: Country }>()
);

export const loadCountryMapFailure = createAction(
  '[Map] Load Country Map Failure',
  props<{ error: string }>()
);

export const selectProvince = createAction(
  '[Map] Select Province',
  props<{ provinceCode: string }>()
);

export const loadProvinceMap = createAction(
  '[Map] Load Province Map',
  props<{ countryCode: string; provinceCode: string }>()
);

export const loadProvinceMapSuccess = createAction(
  '[Map] Load Province Map Success',
  props<{ province: Province }>()
);

export const loadProvinceMapFailure = createAction(
  '[Map] Load Province Map Failure',
  props<{ error: string }>()
);
