import {Directive, HostListener} from '@angular/core';
import {ResizeServiceService} from "../services/resize-service.service";

@Directive({
  selector: '[appResizeListener]'
})
export class ResizeListenerDirective {

  constructor(private resizeService: ResizeServiceService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeService.setWidth(event.target.innerWidth);
  }
}
