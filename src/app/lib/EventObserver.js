export default class EventObserver {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    this.subscribers[event].push(callback);
  }

  publish(event, data) {
    if (!this.subscribers[event]) {
      console.log('Not listener');
      return;
    }
    this.subscribers[event].forEach((subscriberCallback) => subscriberCallback(data));
  }
}
