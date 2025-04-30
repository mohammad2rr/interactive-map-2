import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MapState } from '../models/map.models';

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
