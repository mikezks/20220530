import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, share, Subscription, tap, timer } from 'rxjs';
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

  constructor(private rx: RxConnectorService) {}

  ngOnInit(): void {
    // this.rxjsDemo();

    this.rx.connect(timer(0, 1_000), {
      next: console.log
    });
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
