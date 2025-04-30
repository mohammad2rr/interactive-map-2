import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as MapActions from './map.actions';

@Injectable()
export class MapEffects {
  loadWorldMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.loadWorldMap),
      mergeMap(() =>
        this.http.get('assets/world.json').pipe(
          map((worldMap) => MapActions.loadWorldMapSuccess({ worldMap })),
          catchError((error) => of(MapActions.loadWorldMapFailure({ error })))
        )
      )
    )
  );

  loadCountryMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.loadCountryMap),
      mergeMap(({ countryId }) =>
        this.http.get(`assets/countries/${countryId}.json`).pipe(
          map((countryMap) => MapActions.loadCountryMapSuccess({ countryMap })),
          catchError((error) => of(MapActions.loadCountryMapFailure({ error })))
        )
      )
    )
  );

  loadProvinceMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.loadProvinceMap),
      mergeMap(({ countryId, provinceId }) =>
        this.http
          .get(`assets/countries/${countryId}/provinces/${provinceId}.json`)
          .pipe(
            map((provinceMap) =>
              MapActions.loadProvinceMapSuccess({ provinceMap })
            ),
            catchError((error) =>
              of(MapActions.loadProvinceMapFailure({ error }))
            )
          )
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
