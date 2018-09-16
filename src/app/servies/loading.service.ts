import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {

  public isLoading: Subject<boolean> = new Subject();

  constructor() { }

}
