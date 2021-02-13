import { AfterViewInit, Injectable, OnDestroy, OnInit } from '@angular/core'

@Injectable()
export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnInit() {
    this.onInit()
  }

  ngAfterViewInit() {
    this.onAfterViewInit()
  }

  ngOnDestroy() {
    this.onDestroy()
  }

  protected onInit() {
    //
  }

  protected onAfterViewInit() {
    //
  }

  protected onDestroy() {
    //
  }
}
