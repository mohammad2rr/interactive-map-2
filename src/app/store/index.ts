import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { mapReducer, MapState } from './map/map.reducer';

export interface AppState {
  map: MapState;
}

export const reducers: ActionReducerMap<AppState> = {
  map: mapReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
