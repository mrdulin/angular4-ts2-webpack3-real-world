import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeptService, UserService, IUserApi } from 'root/src/services';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  user: IUserApi;

  private subscription: Subscription = new Subscription();

  constructor(
    private deptService: DeptService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const tagLevel: number = 1;
    this.deptService.getDeptsByTagLevel(tagLevel);
    this.subscription.add(this.userService.getUser().subscribe((user: IUserApi) => this.user = user));
  }

  logout() {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
