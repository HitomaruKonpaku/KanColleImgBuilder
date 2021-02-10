import { Injectable } from '@angular/core'
import firebase from 'firebase/app'
import 'firebase/database'
import { environment } from '../../../environments/environment'

@Injectable()
export class FirebaseDatabaseService {
  private database: firebase.database.Database

  constructor() {
    firebase.initializeApp(environment.firebaseConfig)
    this.database = firebase.database()
  }

  public getDatabase() {
    return this.database
  }

  public goOnline() {
    return this.database.goOnline()
  }

  public goOffline() {
    return this.database.goOffline()
  }

  public getConfigRef() {
    const path = 'config'
    return this.database.ref(path)
  }

  public getDeckIdRef(deckId: string) {
    const path = `decks/${deckId}`
    return this.database.ref(path)
  }
}
