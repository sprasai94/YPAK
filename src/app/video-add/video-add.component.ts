import { VideoProperties } from './../models/video';
import { FileService } from './../service/fileservice.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConditionalExpr } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';


@Component({
  selector: 'app-video-add',
  templateUrl: './video-add.component.html',
  styleUrls: ['./video-add.component.css']
})
export class VideoAddComponent implements OnInit {
  
  files : any [] = [];
  videos: VideoProperties[] = [];
  filteredVideos: VideoProperties[] = [];
  video : VideoProperties = { 
                              leftVidPath: '',
                              rightVidPath: "",
                              title: '',
                              deactivate: null,
                              description: '',
                              leftVidUrl: '',
                              rightVidUrl: ''
                            };
  alert: boolean = false;
  id;
  constructor(
    private afs: AngularFireStorage, 
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute) { 
      this.route.params.subscribe((params = {}) => {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) this.fileService.get(this.id).valueChanges().pipe(take(1)).
          subscribe(u => this.video = u);
        });
    }
     

  onSelect(event) {
    var file = event.target.files[0];
    this.files.push(file);
  }
  async save(form) {
    if (this.id) {
      console.log(form, this.id);
      this.update(form);
    } else {
    let video = {} as VideoProperties;
    video = await this.uploadVideos(form, video);
   
    video.title = form.title;
    video.description = form.description;
    video.deactivate = form.deactivate ? true: false;
    this.fileService.create(video);
    }
    this.alert = true;
    console.log(alert);
  }

  async uploadVideos(form, video): Promise<VideoProperties> {
    try {
        const filesList = this.files;
        for(let index = 0; index < filesList.length; index = index + 1) {
            let file = filesList[index];
            // let fileID = Math.random();
            const storagePath = `${'Videos/'}${file.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
            //const storagePath = "/Videos/"+fileID;
            const ref = this.afs.ref(storagePath);
            if (index == 0) {
              video.leftVidPath = storagePath;
            } else {
              video.rightVidPath = storagePath;
            }
            const uploadTask = ref.put(file);
            // const uploadTask = ref.put(file,
            //     { customMetadata: { Title: form.title, Description: form.description } });

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
    this.alert = false;
    this.router.navigate(['/video-add']);
  }
  update(video) {
    this.fileService.update(this.id, video);
  }
  ngOnInit(): void {
    this.populateVideos();
  }
  private populateVideos() {
    this.fileService
      .getAll()
      .pipe(switchMap(videos => {
        this.videos = this.filteredVideos= videos.filter(v => !v.deactivate);
        return this.route.queryParamMap;
      })).subscribe()
    }

  filter(query: string) {
    this.filteredVideos = (query) ?
      this.videos.filter(u => (u.title.toLowerCase().includes(query.toLowerCase())) && !u.deactivate) :
      this.videos.filter(v => !v.deactivate);
  }
  closeAlert() {
    this.alert = false;
    this.router.navigate(['/video-add']);
  }
   
}
