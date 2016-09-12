import ProgressBar from 'progress';

export default class Bar {
  constructor() {
    this.bar = undefined;
  }

  init(total) { this.bar = new ProgressBar('[:bar] :percent :etas', { total }); }
  tick() { this.bar.tick(); }
}
