import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { GeoJsonStateService } from '../../services/geo-json-state.service';
import { Subject, takeUntil } from 'rxjs';
import { GeoJSON } from 'geojson';

@Component({
  selector: 'app-geo-json-editor',
  templateUrl: './geo-json-editor.component.html',
  styleUrls: ['./geo-json-editor.component.scss'],
  imports: [
    FormsModule,
    MonacoEditorModule
  ],
  standalone: true
})
export class GeoJsonEditorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  geoJsonData: GeoJSON | null = null;

  editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true,
    minimap: { enabled: false },
  };

  constructor(private geoJsonState: GeoJsonStateService) {}

  ngOnInit(): void {
    this.geoJsonState.geoJsonData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.geoJsonData = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get jsonString(): string {
    return JSON.stringify(this.geoJsonData, null, 2);
  }

  onCodeChanged(value: string): void {
    try {
      const parsed = JSON.parse(value) as GeoJSON;
      this.geoJsonState.updateGeoJsonData(parsed);
    } catch (e) {
      console.error('Invalid JSON', e);
    }
  }
}
