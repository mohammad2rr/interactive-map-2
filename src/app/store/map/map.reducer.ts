import { createReducer, on } from '@ngrx/store';
import { MapState } from '../models/map.models';
import * as MapActions from './map.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const initialMapState: MapState = {
  worldMap: {
    countries: [],
    loading: false,
    error: null,
  },
  selectedCountry: {
    country: null,
    loading: false,
    error: null,
  },
  selectedProvince: {
    province: null,
    loading: false,
    error: null,
  },
};

export const mapReducer = createReducer(
  initialMapState,
  // World Map
  on(MapActions.loadWorldMap, (state) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      loading: true,
      error: null,
    },
  })),
  on(MapActions.loadWorldMapSuccess, (state, { countries }) => ({
    ...state,
    worldMap: {
      countries,
      loading: false,
      error: null,
    },
  })),
  on(MapActions.loadWorldMapFailure, (state, { error }) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      loading: false,
      error,
    },
  })),
  // Country Map
  on(MapActions.loadCountryMap, (state) => ({
    ...state,
    selectedCountry: {
      ...state.selectedCountry,
      loading: true,
      error: null,
    },
  })),
  on(MapActions.loadCountryMapSuccess, (state, { country }) => ({
    ...state,
    selectedCountry: {
      country,
      loading: false,
      error: null,
    },
  })),
  on(MapActions.loadCountryMapFailure, (state, { error }) => ({
    ...state,
    selectedCountry: {
      ...state.selectedCountry,
      loading: false,
      error,
    },
  })),
  // Province Map
  on(MapActions.loadProvinceMap, (state) => ({
    ...state,
    selectedProvince: {
      ...state.selectedProvince,
      loading: true,
      error: null,
    },
  })),
  on(MapActions.loadProvinceMapSuccess, (state, { province }) => ({
    ...state,
    selectedProvince: {
      province,
      loading: false,
      error: null,
    },
  })),
  on(MapActions.loadProvinceMapFailure, (state, { error }) => ({
    ...state,
    selectedProvince: {
      ...state.selectedProvince,
      loading: false,
      error,
    },
  }))
);

// Selectors
export const selectMapState = createFeatureSelector<MapState>('map');

export const selectWorldMap = createSelector(
  selectMapState,
  (state: MapState) => state.worldMap
);

export const selectSelectedCountry = createSelector(
  selectMapState,
  (state: MapState) => state.selectedCountry
);

export const selectSelectedProvince = createSelector(
  selectMapState,
  (state: MapState) => state.selectedProvince
);
