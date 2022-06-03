/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {Component, OnInit} from '@angular/core';
import {Flight, FlightService} from '@flight-workspace/flight-lib';
import { ComponentStore } from '@ngrx/component-store';
import { filter, map, Observable, of, switchMap, take } from 'rxjs';

export interface Filter {
  from: string;
  to: string;
  urgent: boolean;
}

export interface LocalState {
  filters: Filter[];
  flights: Flight[];
}

export const initialLocalState: LocalState = {
  filters: [],
  flights: []
};

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  providers: [
    ComponentStore
  ]
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  get flights() {
    return this.flightService.flights;
  }

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  /**
   * Updater
   */

  addFilter = this.localStore.updater(
    (state: LocalState, filter: Filter) => ({
      ...state,
      filters: [
        filter,
        ...state.filters
      ]
    })
  );

  setFlights = this.localStore.updater(
    (state: LocalState, flights: Flight[]) => ({
      ...state,
      flights
    })
  );

  /**
   * Selector
   */

  selectFilters$ = this.localStore.select(
    // Selectors

    // Projector
    state => state.filters
  );

  selectFlights$ = this.localStore.select(
    // Selectors

    // Projector
    state => state.flights
  );

  selectViewModel$ = this.localStore.select(
    // Selectors
    this.selectFilters$,
    this.selectFlights$,
    // Projector
    (filters, flights) => ({ filters, flights})
  );

  /**
   * Effects
   */

  searchFlights = this.localStore.effect(
    (filter$: Observable<Filter>) =>
      filter$.pipe(
        switchMap(filter => this.flightService.find(
          filter.from,
          filter.to,
          filter.urgent
        )),
        map(flights => this.setFlights(flights))
      )
  );

  constructor(
    private flightService: FlightService,
    private localStore: ComponentStore<LocalState>) {
  }

  ngOnInit() {
    this.localStore.setState(initialLocalState);
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.addFilter({
      from: this.from,
      to: this.to,
      urgent: this.urgent
    });

    this.searchFlights(
      this.selectFilters$.pipe(
        take(1),
        map(filters => filters[0])
      )
    );
  }

  delay(): void {
    this.flightService.delay();
  }

}
