import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { Alert } from './../classes/alert';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs/Observable';
import { AlertType } from './../enums/alert-type.enum';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/observable/of';


@Injectable()
export class AuthService {

  public currentUser: Observable<User | null>;
  public currentUserSnapshot: User | null;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {

    this.currentUser = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      })

    this.setCurrentUserSnapshot();
  }

  public signup(firstName: string, lastName: string, email: string, password: string): Observable<boolean> {
    return Observable.fromPromise(
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
          const updatedUser = {
            id: user.uid,
            email: user.email,
            firstName,
            lastName,
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-874ea.appspot.com/o/default-avatar.jpg?alt=media&token=e294ee8a-3a09-4225-a768-85bbc9988c22',
            quote: 'Life is like a box of chocolates, you never know what you are gonna get!',
            bio: 'Bio is under construction...'
          }

          userRef.set(updatedUser);
          return true;
        })
        .catch((err) => false)
    );
  }

  public login(email: string, password: string): Observable<boolean> {
    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => true)
        .catch((err) => false)
    );
  }

  public logout(): void {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('You have been signed out.'));
    });
  }

  private setCurrentUserSnapshot(): void {
    this.currentUser.subscribe(user => this.currentUserSnapshot = user);
  }
}
