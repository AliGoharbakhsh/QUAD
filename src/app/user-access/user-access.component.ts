import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from '../group';
import { User } from '../user';
import { UserAccess } from '../userAccess';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css'],
})
export class UserAccessComponent implements OnInit {
  _userAccessList: UserAccess[] = [];
  @Input() get userAccessList(): UserAccess[] {
    return this._userAccessList;
  }
  set userAccessList(value: UserAccess[]) {
    this._userAccessList = value;
  }

  @Input() userList: User[] = [];
  @Input() groupList: Group[] = [];

  clonedList: UserAccess[] = [];
  tempList: UserAccess[] = [];
  formGroup!: FormGroup;
  formGroupForList!: FormGroup;
  listMode: 'edit' | 'insert' | 'search' = 'search';
  isValidSave = false;

  constructor(private fb: FormBuilder) {
    this.formGroup = fb.group({
      userId: null,
      groupId: null,
      createDate: null,
    });

    this.formGroupForList = fb.group({
      userAccesss: this.fb.array([]),
    });
  }

  get userAccesss() {
    return this.formGroupForList.controls['userAccesss'] as FormArray;
  }

  userAccessFormGroupAt(i: number) {
    return this.userAccesss.at(i) as FormGroup;
  }

  addUserAccess(userAccess?: UserAccess) {
    const userAccessForm = this.fb.group({
      userId: [null, Validators.required],
      groupId: [null, Validators.required],
      createDate: [{ value: '', disabled: true }],
    });

    if (userAccess) {
      userAccessForm.patchValue({
        userId: userAccess.userId,
        groupId: userAccess.groupId,
        createDate: userAccess.createDate,
      });
    }
    if (userAccessForm.valid) this.isValidSave = true;
    this.userAccesss.insert(0, userAccessForm);
  }

  ngOnInit(): void {
    this.clonedList = this.userAccessList;
    if (this.listMode == 'search') {
      this.formGroup?.valueChanges.subscribe((result: UserAccess) => {
        this.clonedList = this.userAccessList.filter(
          (p) =>
            (!result.userId || p.userId?.includes(result.userId)) &&
            (!result.groupId || p.groupId?.includes(result.groupId)) &&
            (!result.createDate || p.createDate == result.createDate)
        );
      });
    }

    this.userAccesss?.valueChanges.subscribe(() => {
      if (this.userAccesss.valid) this.isValidSave = true;
      else this.isValidSave = false;
    });

    this.resetList();
  }

  resetList() {
    this.userAccesss.clear();
    this.userAccessList.forEach((userAccess) => {
      this.addUserAccess(userAccess);
    });
  }

  toggleEditMode() {
    if (this.listMode == 'edit') {
      this.resetList();
      this.listMode = 'search';
    } else this.listMode = 'edit';
  }

  deleteItem(index: number) {
    var userAccess = this.userAccesss.value[index];
    if (
      confirm(
        `Do you want to remove the relationship between ${userAccess.userId} and ${userAccess.groupId}?`
      )
    ) {
      this.userAccesss.controls.splice(index, 1);
    }
  }

  addEmptyRow() {
    var userAccess = new UserAccess();
    this.userAccessList = [userAccess].concat(this.clonedList);
  }

  save() {
    this.userAccessList.splice(0);
    this.tempList = this.userAccesss.value;
    this.tempList.forEach((element) => {
      if (element.createDate == null) {
        element.createDate = new Date();
      }
      this.userAccessList.push(element);
    });
    this.listMode = 'search';
  }

  isExistInUserAccessList(userId: string, groupId: string) {
    return (
      this.userAccessList?.filter(
        (p) => p.userId == userId && p.groupId == groupId
      ).length > 0
    );
  }
}
