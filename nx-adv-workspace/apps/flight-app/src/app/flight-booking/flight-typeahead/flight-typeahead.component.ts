import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { debounceTime, delay, distinctUntilChanged, EMPTY, filter, Observable, share, Subscription, switchAll, switchMap, tap, timer } from 'rxjs';
import { RxConnectorService } from '../../shared/rx-connector/rx-connector.service';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css'],
  providers: [RxConnectorService]
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$: Observable<number> = timer(0, 2_000).pipe(
    tap(value => console.log('Observable processing', value)),
    share()
  );
  subscription = new Subscription();

  control = new FormControl();
  flights$: Observable<Flight[]> = this.getFlightsStream$();
  loading = false;

  constructor(
    private rx: RxConnectorService,
    private http: HttpClient) {}

  ngOnInit(): void {
    // this.rxjsDemo();

    /* this.rx.connect(timer(0, 1_000), {
      next: console.log
    }); */
  }

  getFlightsStream$(): Observable<Flight[]> {
    /**
     * Stream 1: Input field value changes
     * - Trigger
     * - Data Provider
     */
    return this.control.valueChanges.pipe(
      // Add additional state
      // withLatestFrom()
      // Filtering START
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Filtering END
      // Side-effect: Loading state -> property
      tap(() => this.loading = true),
      /**
       * Stream 2: Http Backend call -> returns Flight array
       * - Switch to another stream
       * - Data Provider -> final state to be rendered out
       */
      switchMap(city => this.load(city)),
      // delay(3_000),
      // Side-effect: Loading state -> property
      // Transformation
      // map()
      tap(() => this.loading = false)
    );
  }

  load(from: string): Observable<Flight[]>  {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});

  }

  rxjsDemo(): void {
    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
