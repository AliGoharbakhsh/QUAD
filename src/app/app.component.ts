import { Component,Input, OnInit } from '@angular/core';
import { Group } from './group';
import { User } from './user';
import { UserAccess } from './userAccess';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'user-access';
  active = 1;
  userList: User[] = [];
  groupList: Group[] = [];
  userAccessList: UserAccess[] = [];
}
