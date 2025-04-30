import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MapService } from '../../core/services/map.service';
import * as MapActions from './map.actions';

@Injectable()
export class MapEffects {
  private actions$ = inject(Actions);
  private mapService = inject(MapService);

  loadWorldMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.loadWorldMap),
      mergeMap(() =>
        this.mapService.getWorldMap().pipe(
          map((countries) => MapActions.loadWorldMapSuccess({ countries })),
          catchError((error) =>
            of(MapActions.loadWorldMapFailure({ error: error.message }))
          )
        )
      )
    );
  });

  loadCountryMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.loadCountryMap),
      mergeMap(({ countryCode }) =>
        this.mapService.getCountryMap(countryCode).pipe(
          map((country) => MapActions.loadCountryMapSuccess({ country })),
          catchError((error) =>
            of(MapActions.loadCountryMapFailure({ error: error.message }))
          )
        )
      )
    );
  });

  loadProvinceMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.loadProvinceMap),
      mergeMap(({ countryCode, provinceCode }) =>
        this.mapService.getProvinceMap(countryCode, provinceCode).pipe(
          map((province) => MapActions.loadProvinceMapSuccess({ province })),
          catchError((error) =>
            of(MapActions.loadProvinceMapFailure({ error: error.message }))
          )
        )
      )
    );
  });
}
