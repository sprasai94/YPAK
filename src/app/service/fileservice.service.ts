import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService{

  constructor(private db: AngularFireDatabase) { }

  create(video) {
    return this.db.list('/videos').push(video);
  }
}
