import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CountryMapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {}
}
