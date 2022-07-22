import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from '../group';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  _groupList: Group[] = [];
  @Input() get groupList(): Group[] {
    return this._groupList;
  }
  set groupList(value: Group[]) {
    this._groupList = value;
  }
  clonedList: Group[] = [];
  tempList: Group[] = [];
  formGroup!: FormGroup;
  formGroupForList!: FormGroup;
  listMode: 'edit' | 'insert' | 'search' = 'search';
  isValidSave = false;

  constructor(private fb: FormBuilder) {
    this.formGroup = fb.group({
      groupId: null,
      groupName: null,
      description: null
    });

    this.formGroupForList = fb.group({
      groups: this.fb.array([]),
    });
  }

  get groups() {
    return this.formGroupForList.controls['groups'] as FormArray;
  }

  groupFormGroupAt(i: number) {
    return this.groups.at(i) as FormGroup;
  }

  addGroup(group?: Group) {
    const groupForm = this.fb.group({
      groupId: [null, Validators.required],
      groupName: [null, Validators.required],
      description: [null, Validators.required]
    });

    if (group) {
      groupForm.patchValue({
        groupId: group.groupId,
        groupName: group.groupName,
        description: group.description
      });
    }
    if (groupForm.valid) this.isValidSave = true;
    this.groups.insert(0, groupForm);
  }

  ngOnInit(): void {
    this.clonedList = this.groupList;
    if (this.listMode == 'search') {
      this.formGroup?.valueChanges.subscribe((result: Group) => {
        this.clonedList = this.groupList.filter(
          (p) =>
            (!result.groupId || p.groupId?.includes(result.groupId)) &&
            (!result.groupName || p.groupName?.includes(result.groupName)) &&
            (!result.description || p.description?.includes(result.description))   
        );
      });
    }

    this.groups?.valueChanges.subscribe(() => {
      if (this.groups.valid) this.isValidSave = true;
      else this.isValidSave = false;
    });

    this.resetList();
  }

  resetList() {
    this.groups.clear();
    this.groupList.forEach((group) => {
      this.addGroup(group);
    });
  }

  toggleEditMode() {
    if (this.listMode == 'edit') {
      this.resetList();
      this.listMode = 'search';
    } else this.listMode = 'edit';
  }

  deleteItem(index: number) {
    var group = this.groups.value[index];
    if (confirm(`${group.groupId} will be deleted. Confirm?`)) {
      this.groups.controls.splice(index, 1);
      
    }
   
  }

  addEmptyRow() {
    var group = new Group();
    this.groupList = [group].concat(this.clonedList);
  }

  save() {
    this.groupList.splice(0);
    this.tempList = this.groups.value;
    this.tempList.forEach((element) => {
      this.groupList.push(element);
    });
    this.listMode = 'search';
  }

  isExistInGroupList(groupId: string) {
    return this.groupList?.filter((p) => p.groupId == groupId).length > 0;
  }
}
