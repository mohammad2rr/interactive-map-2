import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-province-map',
  templateUrl: './province-map.component.html',
  styleUrls: ['./province-map.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProvinceMapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {}
}
