import { AfterViewInit, Injectable, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'

@Injectable()
export abstract class BaseComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  ngOnChanges(changes: SimpleChanges) {
    this.onChanges(changes)
  }

  ngOnInit() {
    this.onInit()
  }

  ngAfterViewInit() {
    this.onAfterViewInit()
  }

  ngOnDestroy() {
    this.onDestroy()
  }

  protected onChanges(changes: SimpleChanges) {
    //
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
