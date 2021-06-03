import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { KanColleBuilderToolbarComponent } from './components/kancolle-builder-toolbar/kancolle-builder-toolbar.component'
import { KanColleBuilderComponent } from './components/kancolle-builder/kancolle-builder.component'
import { KanColleComponent } from './components/kancolle.component'
import { KanColleRoutingModule } from './kancolle-routing.module'
import { KanColleBuilderService } from './services/kancolle-builder.service'
import { KanColleConfigService } from './services/kancolle-config.service'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    KanColleRoutingModule,
  ],
  declarations: [
    KanColleComponent,
    KanColleBuilderComponent,
    KanColleBuilderToolbarComponent,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000 },
    },
    KanColleConfigService,
    KanColleBuilderService,
  ],
})
export class KanColleModule { }
