import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { KanColleBuilderComponent } from './components/kancolle-builder/kancolle-builder.component'
import { KanColleComponent } from './components/kancolle.component'
import { KanColleBuilderConfigResolver } from './resolvers/kancolle-builder-config.resolver'

const routes: Routes = [
  {
    path: '',
    component: KanColleComponent,
    children: [
      {
        path: 'builder',
        component: KanColleBuilderComponent,
        resolve: { config: KanColleBuilderConfigResolver },
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
  providers: [KanColleBuilderConfigResolver],
  exports: [RouterModule],
})
export class KanColleRoutingModule { }
