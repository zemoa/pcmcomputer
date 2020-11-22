import { ResizeListenerDirective } from './resize-listener.directive';
import {inject} from "@angular/core/testing";
import 'jasmine';
import {ResizeServiceService} from "../services/resize-service.service";

describe('ResizeListenerDirective', () => {
  let resizeService: ResizeServiceService;
  beforeEach(inject([ResizeServiceService], (rss) => {
    resizeService = rss;
  }))
  it('should create an instance', () => {
    const directive = new ResizeListenerDirective(resizeService);
    expect(directive).toBeTruthy();
  });
});
