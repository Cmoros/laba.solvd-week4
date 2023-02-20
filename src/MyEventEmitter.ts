export type Listener = (...args: any[]) => void;

export default class MyEventEmitter {
  private _events: Map<string, Listener[]> = new Map();

  private _getListeners(eventName: string) {
    return this._events.get(eventName);
  }

  private _addNewEventListener(eventName: string, listener: Listener) {
    this._events.set(eventName, [listener]);
  }

  private _pushNewListener(listener: Listener, listeners: Listener[]) {
    listeners.push(listener);
  }

  private _unshiftNewListener(listener: Listener, listeners: Listener[]) {
    listeners.unshift(listener);
  }

  private _runAllListeners(listeners: Listener[], args: any[]) {
    listeners.forEach((listener) => {
      listener(...args);
    });
  }

  private _removeListener(listener: Listener, listeners: Listener[]): boolean {
    const index = listeners.lastIndexOf(listener);
    if (index < 0) return false;
    listeners.splice(index, 1);
    return true;
  }

  emit(eventName: string, ...args: any[]): void {
    const listeners = this._getListeners(eventName);
    if (!listeners) {
      console.error(`No event name found for: ${eventName}`);
      return;
    }
    this._runAllListeners(listeners, args);
  }

  on(eventName: string, listener: Listener): void {
    const listeners = this._getListeners(eventName);
    if (!listeners) {
      this._addNewEventListener(eventName, listener);
      return;
    }
    this._pushNewListener(listener, listeners);
  }

  prependListener(eventName: string, listener: Listener): void {
    const listeners = this._getListeners(eventName);
    if (!listeners) {
      this._addNewEventListener(eventName, listener);
      return;
    }
    this._unshiftNewListener(listener, listeners);
  }

  removeListener(eventName: string, listener: Listener): boolean {
    const listeners = this._getListeners(eventName);
    if (!listeners) {
      console.error(`No event name found for: ${eventName}`);
      return false;
    }

    return this._removeListener(listener, listeners);
  }
}
