import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Permission, PERMISSIONS } from '../demo-data';
import { PermissionService } from '../permission.service';

@Component({
  selector: 'app-multi-select-search',
  templateUrl: './multi-select-search.component.html',
  styleUrls: ['./multi-select-search.component.css']
})
export class MultiSelectSearchComponent implements OnInit {
  /** list of permissions */
  protected permissions: Permission[] = PERMISSIONS;
  selectedPermissions = [];

  /** control for the selected permission for multi-selection */
  public permissionMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public permissionMultiFilterCtrl: FormControl = new FormControl();

  /** list of permissions filtered by search keyword */
  public filteredPermissionsMulti: ReplaySubject<
    Permission[]
  > = new ReplaySubject<Permission[]>(1);

  @ViewChild('multiSelect') multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  change(event: { isUserInput: any; source: { value: any; selected: any } }) {
    if (event.isUserInput) {
      this.selectedPermissions.push(event.source.value.name);
      this.permissionService.sendPermission(event.source.value.name);
    }
  }

  constructor(private permissionService: PermissionService) {}

  ngOnInit() {
    this.filteredPermissionsMulti.next(this.permissions.slice());

    // listen for search field value changes
    this.permissionMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPermissionsMulti();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredpermissions are loaded initially
   */
  protected setInitialValue() {
    this.filteredPermissionsMulti
      .pipe(
        take(1),
        takeUntil(this._onDestroy)
      )
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredpermissions are loaded initially
        // and after the mat-option elements are available

        this.multiSelect.compareWith = (a: Permission, b: Permission) =>
          a && b && a.id === b.id;
      });
  }

  protected filterPermissionsMulti() {
    if (!this.permissions) {
      return;
    }
    // get the search keyword
    let search = this.permissionMultiFilterCtrl.value;
    console.log(search);
    if (!search) {
      this.filteredPermissionsMulti.next(this.permissions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the permissions
    this.filteredPermissionsMulti.next(
      this.permissions.filter(
        permission => permission.name.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
