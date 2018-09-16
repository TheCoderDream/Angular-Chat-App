import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertType } from './../../enums/alert-type.enum';
import { Alert } from './../../classes/alert';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from './../../servies/loading.service';
import { Subscription } from 'rxjs/Subscription';
import { AlertService } from './../../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  public signupForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, 
    private alertService: AlertService,
    private auth: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.createForm();
   }

  ngOnInit() {
  }

  private createForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public submit(): void {

    if (this.signupForm.valid) {
      const {firstName, lastName, email, password} = this.signupForm.value;

      // TODO call the auth service
      this.subscriptions.push(
        this.auth.signup(firstName, lastName, email, password).subscribe(success => {
          if (success) {
            this.router.navigate(['/chat']);
          } else {
            const failedSignupAlert = new Alert('There was a problem signing up, try again.', AlertType.Danger);
            this.alertService.alerts.next(failedSignupAlert);
          }

          this.loadingService.isLoading.next(false);
        })
      );
    } else {
      const failedSignupAlert = new Alert('Please enter a valid name, email and password, try again.', AlertType.Danger);
      this.alertService.alerts.next(failedSignupAlert);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
