import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { KanColleBuilderComponent } from './components/kancolle-builder/kancolle-builder.component'
import { KanColleComponent } from './components/kancolle.component'

const routes: Routes = [
  {
    path: '',
    component: KanColleComponent,
    children: [
      {
        path: 'builder',
        component: KanColleBuilderComponent,
      },
      {
        path: '**',
        redirectTo: 'builder',
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KanColleRoutingModule { }
