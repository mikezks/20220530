import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable, PartialObserver } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RxConnectorService implements OnDestroy {
  private subscription = new Subscription();

  connect<T>(stream$: Observable<T>, observer?: PartialObserver<T>): Subscription {
    const subscription = stream$.subscribe(observer);
    this.subscription.add(subscription);
    return subscription;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
