import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor( private storage : AngularFireStorage) { }

  ngOnInit() {
    this.resetForm()
  }

  imgSrc = "/assets/img/drag.png";;
  selectedImg :any = null;
  isSubmitted = false;

  formTemplate = new FormGroup({
    caption: new FormControl(''),
    category: new FormControl(''),
    imageUrl: new FormControl('')
  })

  showPreview(event) {
    console.log(event, "event")
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => { this.imgSrc = e.target.result; console.log(e, "e") };
        reader.readAsDataURL(event.target.files[0]);
        this.selectedImg = event.target.files[0];
      }
      else {
        this.imgSrc = "/assets/img/drag.png";
        this.selectedImg = null;
      }
  }

  onSubmit(formvalue){
    this.isSubmitted = true;
    console.log(formvalue , "formvalue")
    console.log(this.formTemplate.valid , "formTemplate.valid")
    if(this.formTemplate.valid){
      var filePath = `${formvalue.category}/${this.selectedImg.name}_${new Date().getTime()}`;
      console.log(filePath , "filePath")
      const fileref = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
        finalize(()=>{
          fileref.getDownloadURL().subscribe((url)=>{
            formvalue['imageUrl'] = url;
            this.resetForm()
          })
        })
      ).subscribe();
    }
  }

  get formControls(){
    return this.formTemplate['controls']
  }

  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption : '',
      imageUrl : '',
      category : ''
    });
    this.imgSrc = "/assets/img/drag.png";
    this.isSubmitted = false;
    this.selectedImg = null;
  }

}
