import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'imageditor';
  @ViewChild('previewImg') previewImg: any;

  filterOptions = [
    { id: 'brightness', name: 'Brightness', active: true },
    { id: 'saturation', name: 'Saturation', active: false },
    { id: 'inversion', name: 'Inversion', active: false },
    { id: 'grayscale', name: 'Grayscale', active: false }
  ];

  filterSlider = { max: '200', value: '100' };
  selectedFilter = this.filterOptions[0];

  brightness = '100';
  saturation = '100';
  inversion = '0';
  grayscale = '0';
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  loadImage(event: Event) {
    const fileInput:any = event.target as HTMLInputElement;
    const file = fileInput.files[0];
    if (!file) return;
    this.imageSelected = true

    const imgElement = this.previewImg.nativeElement as HTMLImageElement;
    imgElement.src = URL.createObjectURL(file);
    imgElement.addEventListener('load', () => {
      this.resetFilter();
      //@ts-ignore
      document.querySelector('.container').classList.remove('disable');
    });
  }

  applyFilter() {
    const imgElement = this.previewImg.nativeElement as HTMLImageElement;
    imgElement.style.transform = `rotate(${this.rotate}deg) scale(${this.flipHorizontal}, ${this.flipVertical})`;
    imgElement.style.filter = `brightness(${this.brightness}%) saturate(${this.saturation}%) invert(${this.inversion}%) grayscale(${this.grayscale}%)`;
  }

  selectFilter(option:any) {
    this.filterOptions.forEach((opt) => (opt.active = false));
    option.active = true;
    this.selectedFilter = option;

    if (option.id === 'brightness') {
      this.filterSlider.max = '200';
      this.filterSlider.value = this.brightness;
    } else if (option.id === 'saturation') {
      this.filterSlider.max = '200';
      this.filterSlider.value = this.saturation;
    } else if (option.id === 'inversion') {
      this.filterSlider.max = '100';
      this.filterSlider.value = this.inversion;
    } else {
      this.filterSlider.max = '100';
      this.filterSlider.value = this.grayscale;
    }
  }

  updateFilter() {
    if (this.selectedFilter.id === 'brightness') {
      this.brightness = this.filterSlider.value;
    } else if (this.selectedFilter.id === 'saturation') {
      this.saturation = this.filterSlider.value;
    } else if (this.selectedFilter.id === 'inversion') {
      this.inversion = this.filterSlider.value;
    } else {
      this.grayscale = this.filterSlider.value;
    }
    this.applyFilter();
  }

  rotateImage(direction: string) {
    if (direction === 'left') {
      this.rotate -= 90;
    } else if (direction === 'right') {
      this.rotate += 90;
    }
    this.applyFilter();
  }

  flipImage(direction: string) {
    if (direction === 'horizontal') {
      this.flipHorizontal = this.flipHorizontal === 1 ? -1 : 1;
    } else if (direction === 'vertical') {
      this.flipVertical = this.flipVertical === 1 ? -1 : 1;
    }
    this.applyFilter();
  }

  resetFilter() {
    this.brightness = '100';
    this.saturation = '100';
    this.inversion = '0';
    this.grayscale = '0';
    this.rotate = 0;
    this.flipHorizontal = 1;
    this.flipVertical = 1;
    this.selectFilter(this.filterOptions[0]);
    this.applyFilter();
  }

  saveImage() {
    const canvas = document.createElement('canvas');
    const ctx:any = canvas.getContext('2d');
    const imgElement = this.previewImg.nativeElement as HTMLImageElement;

    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    ctx.filter = `brightness(${this.brightness}%) saturate(${this.saturation}%) invert(${this.inversion}%) grayscale(${this.grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (this.rotate !== 0) {
      ctx.rotate((this.rotate * Math.PI) / 180);
    }
    ctx.scale(this.flipHorizontal, this.flipVertical);
    ctx.drawImage(imgElement, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = canvas.toDataURL();
    link.click();
  }

  chooseImage() {
    const fileInput:any = document.querySelector('.file-input');
    fileInput.click();
  }

  imageSelected: boolean = false

  noAction(){

  }


}
