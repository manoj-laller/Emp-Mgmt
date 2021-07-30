import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  )
  {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/Employees';

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    let sub$ = this.authService.IsAuthenticated().subscribe(d => {if(d) {
      this.router.navigate([this.returnUrl]);
        sub$.unsubscribe();
      }
    });
  }

  onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;

    if (this.form.valid) {
      try {
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;

        this.authService.Login(username, password);

       let sub$ = this.authService.IsAuthenticated().subscribe(d => {if(d) {
          this.router.navigate(["/Employees"]);
            sub$.unsubscribe();
          }
        });
      }
      catch (err) {
        this.loginInvalid = true;
      }
    }
    else {
      this.formSubmitAttempt = true;
    }
  }
}
