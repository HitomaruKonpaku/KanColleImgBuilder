import { NgModule } from '@angular/core'
import { FirebaseDatabaseService } from './services/firebase-database.service'

@NgModule({
  providers: [FirebaseDatabaseService],
})
export class FirebaseModule { }
