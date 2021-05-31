import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {

  permissionTreeChanged = new Subject<any>();
  private permissionsChange = new Subject<any>();

  constructor() {}

  sendPermission(selectedId) {
    // console.log(selectedId);
    this.permissionsChange.next(selectedId);
  }

  getPermission(): Observable<any> {
    return this.permissionsChange.asObservable();
  }

}
