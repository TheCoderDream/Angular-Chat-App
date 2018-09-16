import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public currentUser: any = null;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.currentUser.subscribe( user => {
      this.currentUser = user;
    })
  }
}
