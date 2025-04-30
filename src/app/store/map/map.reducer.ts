import { createReducer, on } from '@ngrx/store';
import * as MapActions from './map.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface MapState {
  worldMap: any;
  countryMap: any;
  provinceMap: any;
  selectedCountry: string | null;
  selectedProvince: string | null;
  loading: boolean;
  error: any;
}

export const initialState: MapState = {
  worldMap: null,
  countryMap: null,
  provinceMap: null,
  selectedCountry: null,
  selectedProvince: null,
  loading: false,
  error: null,
};

export const mapReducer = createReducer(
  initialState,
  on(MapActions.loadWorldMap, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MapActions.loadWorldMapSuccess, (state, { worldMap }) => ({
    ...state,
    worldMap,
    loading: false,
  })),
  on(MapActions.loadWorldMapFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(MapActions.selectCountry, (state, { countryId }) => ({
    ...state,
    selectedCountry: countryId,
    selectedProvince: null,
  })),
  on(MapActions.loadCountryMap, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MapActions.loadCountryMapSuccess, (state, { countryMap }) => ({
    ...state,
    countryMap,
    loading: false,
  })),
  on(MapActions.loadCountryMapFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(MapActions.selectProvince, (state, { provinceId }) => ({
    ...state,
    selectedProvince: provinceId,
  })),
  on(MapActions.loadProvinceMap, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MapActions.loadProvinceMapSuccess, (state, { provinceMap }) => ({
    ...state,
    provinceMap,
    loading: false,
  })),
  on(MapActions.loadProvinceMapFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

// Selectors
export const selectMapState = createFeatureSelector<MapState>('map');

export const selectWorldMap = createSelector(
  selectMapState,
  (state: MapState) => state.worldMap
);

export const selectCountryMap = createSelector(
  selectMapState,
  (state: MapState) => state.countryMap
);

export const selectProvinceMap = createSelector(
  selectMapState,
  (state: MapState) => state.provinceMap
);

export const selectLoading = createSelector(
  selectMapState,
  (state: MapState) => state.loading
);

export const selectError = createSelector(
  selectMapState,
  (state: MapState) => state.error
);
