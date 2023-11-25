import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  photos: { filepath: string; webviewPath: string; }[] = [];

  constructor(public photoService:PhotoService) {
    // Obtener las fotos al inicializar la página
    this.photoService.getSavedPhotos().then(photos => {
      this.photos = photos;
    });
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
