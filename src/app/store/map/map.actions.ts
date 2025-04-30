import { createAction, props } from '@ngrx/store';
import { Country, Province } from '../../core/services/map.service';
import { FeatureCollection, Geometry } from 'geojson';
//import { MapError } from './map.effects';

export const loadWorldMap = createAction('[Map] Load World Map');

export const loadWorldMapSuccess = createAction(
  '[Map] Load World Map Success',
  props<{ worldMap: any }>()
);

export const loadWorldMapFailure = createAction(
  '[Map] Load World Map Failure',
  props<{ error: any }>()
);

export const selectCountry = createAction(
  '[Map] Select Country',
  props<{ countryId: string }>()
);

export const loadCountryMap = createAction(
  '[Map] Load Country Map',
  props<{ countryId: string }>()
);

export const loadCountryMapSuccess = createAction(
  '[Map] Load Country Map Success',
  props<{ countryMap: any }>()
);

export const loadCountryMapFailure = createAction(
  '[Map] Load Country Map Failure',
  props<{ error: any }>()
);

export const selectProvince = createAction(
  '[Map] Select Province',
  props<{ provinceId: string }>()
);

export const loadProvinceMap = createAction(
  '[Map] Load Province Map',
  props<{ countryId: string; provinceId: string }>()
);

export const loadProvinceMapSuccess = createAction(
  '[Map] Load Province Map Success',
  props<{ provinceMap: any }>()
);

export const loadProvinceMapFailure = createAction(
  '[Map] Load Province Map Failure',
  props<{ error: any }>()
);
