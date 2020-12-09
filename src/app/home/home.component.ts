import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageUrl: string = "./assets/images/5D.jpg";
  href: string = this._router.url;
  user:string=localStorage.getItem('username') ;
  currentUrlKey='';
  errorMessage:string='';
  addmomentForm: FormGroup;
  submitClick:boolean=false;
  loading:boolean=false;
  addSynonym: boolean = false;
  synonyms=[]; image;
  moments;
  momentId;
  constructor(private _actRoute: ActivatedRoute, private _router: Router, private _authUser: ServicesService, private _formbuilder: FormBuilder) {
    _router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) { 
        if (this.href != val['url']) {
          if(RegExp('/home;key*').test(val['url'])){
            this.currentUrlKey = this._actRoute.snapshot.paramMap.get('key') ? this._actRoute.snapshot.paramMap.get('key') : 'view';
            if(this.currentUrlKey=='view'){
              this.getMoments();
            }
          }
          this.href = this._router.url;
        }
      }
    });
  }

  ngOnInit(): void {
    this.user=localStorage.getItem('username') ;
    if(this.user==null){
      this._router.navigate(['login']);
    }
    this.getMoments();
    this.currentUrlKey = this._actRoute.snapshot.paramMap.get('key') ? this._actRoute.snapshot.paramMap.get('key') : 'view';
    this.addmomentForm = this._formbuilder.group({
      image: [this.image,Validators.required],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      tags: [this.synonyms],
      user:[this.user]
    })
  }
  get imagefromform() {
    return this.addmomentForm.get('image');
  }
  get descriptionfromform() {
    return this.addmomentForm.get('description');
  }
  onLogout(){
    localStorage.clear();
    this._router.navigate(['login']);
  }

  processFile(event) {
    if(event.target.files.length>0){
      let formData= new FormData();
    formData.append('file',event.target.files[0])    
    this._authUser.uploadImage(formData)
    .subscribe((res)=>{
      console.log(res)
    },
    (err)=>{
      console.log(err)
    })
  }
  }
  onSubmit() {
    this.submitClick = true;
    this.loading = true;
    console.log(this.addmomentForm.value)
    if (this.addmomentForm.invalid) {
      this.loading = false;
      this.errorMessage='please provide all fields'
      return;
    }
    console.log(this.momentId)
    if(this.momentId!=undefined){
      this._authUser.editProduct(this.addmomentForm.value, this.momentId)
      .subscribe(
        (res) => { //console.log(res)
          if (res) {
            this.addmomentForm.reset();
            this.submitClick=false;
            this._router.navigate(['/home', { 'key': 'view' }]);
          }
        },
        (err) => {
          console.log(err)
        }
      )
    }else{
      this._authUser.addProduct(this.addmomentForm.value)
      .subscribe(
        (res) => { //console.log(res)
          if (res) {
            this.addmomentForm.reset();
            this.submitClick=false;
            this._router.navigate(['/home', { 'key': 'view' }]);
          }
        },
        (err) => {
          console.log(err)
        }
      )
    }
   
      this.loading = false;
      this.errorMessage=''
  }
  getMoments(){
    this._authUser.getMoments()
    .subscribe(
      (res) => { //console.log(res)
        if (res) {
          this.moments=res;
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  onAddSynonym() {
    this.addSynonym = true;
  }
  addedSynonym(syn) {
    this.synonyms.push(syn.toLowerCase())
    this.addSynonym = false;
  }
  onEdit(moment){
    //this.addmomentForm.setValue(moment);
    this.addmomentForm.patchValue({
      user: this.user,
     // image:moment.image,
      description:moment.description,
      tags:moment.tags
    });
    this.synonyms=moment.tags;
    this.momentId=moment._id;
    this._router.navigate(['/home', { 'key': 'add' }]);
  }
  onCancelEdit(){
    this.momentId='';
    this.addmomentForm.reset();
    this._router.navigate(['/home', { 'key': 'view' }]);
  }
  onDelete(id){
    if(confirm('Are you sure to delete ?')){
      this._authUser.deleteMoment(id)
      .subscribe(
        (res) => { //console.log(res)
          if (res) {
            this.getMoments()
          }
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }
}
