import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'

@Component({ template: '' })
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
