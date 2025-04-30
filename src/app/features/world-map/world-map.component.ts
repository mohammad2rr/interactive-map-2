import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WorldMapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {}
}
