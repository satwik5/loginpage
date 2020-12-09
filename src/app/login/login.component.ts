import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ServicesService } from '../services.service';
//import { CryptoJS }from 'crypto-js';
import { MustMatch } from "./validators/mustmatch";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  imageUrl: string = "./assets/images/5D.jpg";
  signUpForm: FormGroup;
  signInForm: FormGroup;
  signin: boolean = true;
  signinClick: boolean = false;
  signupClick: boolean = false;
  errorMessage: string = '';
  successMsg: string = '';
  loading: boolean = false;

  constructor(private _formbuilder: FormBuilder,
    private _router: Router, private _authUser: ServicesService) { }

  ngOnInit(): void {
    this.signInForm = this._formbuilder.group({
      loginname: ['', Validators.required],
      loginpassword: ['', Validators.required]
    });
    this.signUpForm = this._formbuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(4)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: MustMatch('password', 'cpassword') });
    // console.log(localStorage.getItem('username'))
    if (localStorage.getItem('username') !== null) {
      this._router.navigate(['home/', { key: 'view' }]);
    }
  }
  get fullnamefromform() {
    return this.signUpForm.get('fullname');
  }
  get emailfromform() {
    return this.signUpForm.get('email');
  }
  get mobilefromform() {
    return this.signUpForm.get('mobile');
  }
  get cityfromform() {
    return this.signUpForm.get('city');
  }
  get passwordfromform() {
    return this.signUpForm.get('password');
  }
  get cpasswordfromform() {
    return this.signUpForm.get('cpassword');
  }

  get loginnamefromform() {
    return this.signInForm.get('loginname');
  }
  get loginpasswordfromform() {
    return this.signInForm.get('loginpassword');
  }
  /*
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data),'password').toString();
    } catch (e) {
      console.log(e);
    }
  }
  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data,'password');
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }*/

  onSignIn() {

    this.loading = true;
    this.signinClick = true;
    this.successMsg = '';
    if (this.signInForm.invalid) {
      this.errorMessage = 'Invalid username or password';
      this.loading = false;
      return;
    }
    //using mysql data
    console.log(this.signInForm)
    this._authUser.onLogin(this.signInForm.get('loginname').value, this.signInForm.get('loginpassword').value)
      .subscribe(
        (res) => { console.log(res)
          if (!res) {
            this.errorMessage = '*Invalid username or password';
            this.loading = false;
          }
          else {
            localStorage.setItem('username', this.signInForm.get('loginname').value);
            this._router.navigate(['home/', { key: 'view' }]);
          }
        },
        (err) => { //console.log(err)
          this.errorMessage = err;
        }
      );
  }
  onSignUp() {
    console.log(this.signUpForm.value)
    this.loading = true;
    if (this.signUpForm.invalid) {
      this.signupClick = true;
      this.loading = false;
      return;
    }
    this._authUser.createUser(this.signUpForm.value)
      .subscribe(
        (res) => { //console.log(res['status'])
          if (!res) {
            this.errorMessage = '*User already exist';
          }
          else {
            this.navLogin();
            this.successMsg='Account created successfully';
          }
        },
        (err) => { //console.log(err)
          this.errorMessage = err;
        }
      );
      this.loading = false;
  }
  navRegister() {
    this.signin = false;
    this.errorMessage = '';
    this.signInForm.reset();
    this.signinClick = false;
  }
  navLogin() {
    this.signin = true;
    this.errorMessage = '';
    this.signUpForm.reset();
    this.signupClick = false;
  }
}
