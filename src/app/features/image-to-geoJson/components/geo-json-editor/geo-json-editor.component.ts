import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { GeoJsonStateService } from '../../services/geo-json-state.service';
import { Subject, takeUntil } from 'rxjs';
import { GeoJSON } from 'geojson';

@Component({
  selector: 'app-geo-json-editor',
  templateUrl: './geo-json-editor.component.html',
  styleUrls: ['./geo-json-editor.component.scss'],
  standalone: true,
  imports: [FormsModule, MonacoEditorModule],
})
export class GeoJsonEditorComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private destroy$ = new Subject<void>();
  geoJsonData: GeoJSON | null = null;
  code: string = '';
  isEditorReady = false;

  editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    formatOnType: true,
    folding: true,
    lineNumbers: 'on',
    roundedSelection: true,
    readOnly: false,
    fontSize: 14,
    wordWrap: 'on',
    renderWhitespace: 'none',
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
    },
  };

  constructor(
    private geoJsonState: GeoJsonStateService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.geoJsonState.geoJsonData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.geoJsonData = data;
        if (this.isEditorReady && data) {
          this.ngZone.run(() => {
            this.code = JSON.stringify(data, null, 2) || '';
          });
        }
      });
  }

  ngAfterViewInit(): void {
    this.isEditorReady = true;
    if (this.geoJsonData) {
      this.code = JSON.stringify(this.geoJsonData, null, 2);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCodeChanged(value: string): void {
    try {
      const parsed = JSON.parse(value) as GeoJSON;
      this.geoJsonState.updateGeoJsonData(parsed);
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  }

  onEditorInit(editor: any): void {
    this.isEditorReady = true;
    editor.getModel()?.updateOptions({ tabSize: 2 });
    editor.layout();

    if (this.geoJsonData) {
      this.code = JSON.stringify(this.geoJsonData, null, 2);
      setTimeout(() => {
        editor.getAction('editor.action.formatDocument').run();
      }, 100);
    }
  }
}
