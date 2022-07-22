import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  _userList: User[] = [];
  @Input() get userList(): User[] {
    return this._userList;
  }
  set userList(value: User[]) {
    this._userList = value;
  }
  clonedList: User[] = [];
  tempList: User[] = [];
  formGroup!: FormGroup;
  formGroupForList!: FormGroup;
  listMode: 'edit' | 'insert' | 'search' = 'search';
  isValidSave = false;

  constructor(private fb: FormBuilder) {
    this.formGroup = fb.group({
      userId: null,
      firstName: null,
      lastName: null,
      loginName: null,
      password: null,
      email: null,
    });

    this.formGroupForList = fb.group({
      users: this.fb.array([]),
    });
  }

  get users() {
    return this.formGroupForList.controls['users'] as FormArray;
  }

  userFormGroupAt(i: number) {
    return this.users.at(i) as FormGroup;
  }

  addUser(user?: User) {
    const userForm = this.fb.group({
      userId: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      loginName: [null, Validators.required],
      password: [null, Validators.required],
      email: null,
    });

    if (user) {
      userForm.patchValue({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        loginName: user.loginName,
        password: user.password,
        email: user.email,
      });
    }
    if (userForm.valid) this.isValidSave = true;
    this.users.insert(0, userForm);
  }

  ngOnInit(): void {
    this.clonedList = this.userList;
    if (this.listMode == 'search') {
      this.formGroup?.valueChanges.subscribe((result: User) => {
        this.clonedList = this.userList.filter(
          (p) =>
            (!result.userId || p.userId.includes(result.userId)) &&
            (!result.firstName || p.firstName.includes(result.firstName)) &&
            (!result.lastName || p.lastName.includes(result.lastName)) &&
            (!result.loginName || p.loginName.includes(result.loginName)) &&
            (!result.password || p.password.includes(result.password)) &&
            (!result.email || p.email.includes(result.email))
        );
      });
    }

    this.users?.valueChanges.subscribe(() => {
      if (this.users.valid) this.isValidSave = true;
      else this.isValidSave = false;
    });

    this.resetList();
  }

  resetList() {
    this.users.clear();
    this.userList.forEach((user) => {
      this.addUser(user);
    });
  }

  toggleEditMode() {
    if (this.listMode == 'edit') {
      this.resetList();
      this.listMode = 'search';
    } else this.listMode = 'edit';
  }

  deleteItem(index: number) {
    var user = this.users.value[index];
    if (confirm(`${user.userId} will be deleted. Confirm?`)) {
      this.users.controls.splice(index, 1);
      
    }
  }

  addEmptyRow() {
    var user = new User();
    this.userList = [user].concat(this.clonedList);
  }

  save() {
    this.userList.splice(0);
    this.tempList = this.users.value;
    this.tempList.forEach((element) => {
      this.userList.push(element);
    });
    this.listMode = 'search';
  }

  isExistInUserList(userId: string) {
    return this.userList?.filter((p) => p.userId == userId).length > 0;
  }
}
