import { VideoProperties } from './../models/video';
import { FileService } from './../service/fileservice.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-video-add',
  templateUrl: './video-add.component.html',
  styleUrls: ['./video-add.component.css']
})
export class VideoAddComponent implements OnInit {
  
  files : any [] = [];

  constructor(private afs: AngularFireStorage, private fileService: FileService) { }
  onSelect(event) {
    var file = event.target.files[0];
    this.files.push(file);
  }
  async save(form) {
    let video = {} as VideoProperties;
    video = await this.uploadVideos(form, video);
   
    video.title = form.title;
    video.description = form.description;
    video.leftVidUrl = video.leftVidUrl;
    video.rightVidUrl = video.rightVidUrl;
    this.fileService.create(video);
  }

  async uploadVideos(form, video): Promise<VideoProperties> {
    try {
        const filesList = this.files;
        for(let index = 0; index < filesList.length; index = index + 1) {
            let file = filesList[index];
            let fileID = Math.random();
            //const storagePath = ${'Videos/'}${file.name}_${new Date().getTime()};
            const storagePath = "/Videos/"+fileID;
            const ref = this.afs.ref(storagePath);

            const uploadTask = ref.put(file,
                { customMetadata: { Title: form.title, Description: form.description } });

            // const asyncUploadTask = this.promiseWrapper(uploadTask);

            await uploadTask.then(async (uploadSnapshot: firebase.storage.UploadTaskSnapshot) => {
                //Fetch the download URL of the Storage file
                await uploadSnapshot.ref.getDownloadURL()
                    .then((downloadURL) => {
                        if (index == 0) {
                            video.leftVidUrl = downloadURL;
                        } else {
                            video.rightVidUrl = downloadURL;
                        }
                    }).catch(err => {
                        throw err;
                    })
            }).catch(err => {
                throw err;
            })
        }
    }
    catch(err) {
        throw(err)
    }
      return video;
    }

  clearForm(form:NgForm) {
    form.resetForm();
  }
  ngOnInit(): void {
  }

}
