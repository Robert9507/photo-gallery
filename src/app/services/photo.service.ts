import { Injectable } from '@angular/core';
import { Camera, CameraPermissionType, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Filesystem, Directory} from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';



@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private photos: { filepath: string; webviewPath: string; }[] = [];

  constructor() { }

  public async addNewToGallery() {
    // Solicitar permisos de la cámara
    const permission = await Camera.requestPermissions();

    try {
      // Take a photo
      const capturePhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      // Asegurarse de que el directorio de destino exista
      const directoryExists = await Filesystem.readdir({
        path: 'gallery/photos',
      });

      // Crea el directorio si no existe.
      if (!directoryExists.files.length) {
        await Filesystem.mkdir({
          path: 'gallery/photos',
          directory: Directory.Data,
        });
      }

      // Guardar la foto en la galería
      const savedFile = await Filesystem.copy({
        from: capturePhoto.webPath!,
        to: 'gallery/photos/' + new Date().getTime() + '.jpeg', 
      });

      // Mostrar la foto en la interfaz de usuario
      this.photos.unshift({
      filepath: 'file://' + savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      });
    } catch (error) {
      console.error('Error al tomar o guardar la foto', error);
    }
  }

  public async getSavedPhotos(): Promise<{ filepath: string; webviewPath: string; }[]> {
    // Lógica para obtener las fotos guardadas
    try {
      const photos = await Filesystem.readdir({
        path: 'gallery/photos',
      });

      // Crear la lista de fotos con las rutas correctas
      const photoList = photos.files.map(file => ({
        filepath: 'file://' + 'gallery/photos' + '/' + file,
        webviewPath: Capacitor.convertFileSrc('gallery/photos' + '/' + file),
      }));

      // Actualizar la propiedad 'photos'
      this.photos = photoList;

      return photoList;
    } catch (error) {
      console.error('Error al obtener fotos guardadas', error);
      return [];
    }
  }
}
