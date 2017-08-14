import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';

interface IBreadcrumbData {
  name: string;
  key: string;
}

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  public datas: IBreadcrumbData[] = [];
  private _routerSubscription: Subscription;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.generateData(this._activatedRoute);
    console.log(this.datas);

    this._routerSubscription = this._router.events
      .filter((event: Event): boolean => event instanceof NavigationEnd)
      .subscribe((navigationEnd: NavigationEnd) => {
        this.datas = [];
        console.log(this._activatedRoute);
        this.generateData(this._activatedRoute);
        console.log(this.datas);
      });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

  generateData(activatedRoute: ActivatedRoute) {
    const childActivatedRoute: ActivatedRoute = activatedRoute.children[0];
    if(!childActivatedRoute) return;
    const snapshot: ActivatedRouteSnapshot = childActivatedRoute.snapshot;
    if (snapshot.data && snapshot.data.name && snapshot.url.length) {
      const name: string = snapshot.data.name;
      const url: string = snapshot.url[0].path;
      this.datas.push({ name, key: url });

    }
    this.generateData(childActivatedRoute);
  }

}
