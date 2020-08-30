import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  response: string;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

  constructor(private authSerivce: AuthService, private userService: UserService, private alertify: AlertifyService ) { }


    ngOnInit() {
      this.initializeUploader();
  }

    fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authSerivce.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, header) => {
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if(photo.isMain)
        {
          this.authSerivce.changeMemberPhoto(photo.url);
          this.authSerivce.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authSerivce.currentUser));
        }
      }
    };
  }
  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authSerivce.decodedToken.nameid, photo.id).subscribe(() => {
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.authSerivce.changeMemberPhoto(photo.url);
      this.authSerivce.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authSerivce.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }

  deletePhoto(id: number){
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
    this.userService.deletePhoto(this.authSerivce.decodedToken.nameid, id).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
      this.alertify.success('Photo has been deleted');
    }, error => {
      this.alertify.error('Failed to delet the photo');
    });
  });
  }

}
