import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private _socket: Socket) {}

  getDateCreatedPatient(): Observable<string> {
    return this._socket.fromEvent<string>('registratedPatient');
  }

  getDisableDateWhenCreatedPatient(): Observable<string> {
    return this._socket.fromEvent<string>('disabledDate');
  }

  disconnect() {
    this._socket.disconnect();
  }

  connect() {
    if (!this.isConnected()) {
      this._socket.connect();
    }
  }

  isConnected(): boolean {
    return this._socket.ioSocket.connected;
  }
}
