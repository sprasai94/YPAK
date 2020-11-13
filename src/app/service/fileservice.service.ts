import { VideoProperties } from './../models/video';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { getObservableFromList } from '../firebase-extension';

@Injectable({
  providedIn: 'root'
})
export class FileService{

  constructor(private db: AngularFireDatabase) { }

  create(video) {
    return this.db.list('/videos').push(video);
  }
  get(uid: string): AngularFireObject<VideoProperties> {
    return this.db.object('/videos/' + uid);
  }
  getAll() {
    let list = this.db.list('/videos');
    return getObservableFromList(list);
  }
  update(videoId, video) {
    this.db.object('/videos/'+ videoId).update({title: video.title, description: video.description, deactivate: video.deactivate ? true: false });
  }
}
