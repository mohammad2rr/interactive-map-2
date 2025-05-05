import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { GeoJSON } from 'geojson';

@Component({
  selector: 'app-geo-json-editor',
  templateUrl: './geo-json-editor.component.html',
  styleUrls: ['./geo-json-editor.component.scss'],
  imports: [
    FormsModule,
    MonacoEditorModule, // Import the module without forRoot()
  ],
  standalone: true
})
export class GeoJsonEditorComponent {
  @Input() geoJsonData!: GeoJSON;
  @Output() geoJsonUpdated = new EventEmitter<GeoJSON>();

  editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true,
    minimap: { enabled: false },
  };

  get jsonString(): string {
    return JSON.stringify(this.geoJsonData, null, 2);
  }

  onCodeChanged(value: string): void {
    try {
      const parsed = JSON.parse(value);
      this.geoJsonUpdated.emit(parsed);
    } catch (e) {
      console.error('Invalid JSON', e);
    }
  }
}
