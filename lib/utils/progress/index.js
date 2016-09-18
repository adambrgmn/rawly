import ProgressBar from 'progress';

let bar;

exports.init = (total) => {
  bar = new ProgressBar('[:bar] :current/:total', { total, width: 1000 });
};

exports.tick = (val) => {
  if (bar) bar.tick(val);
};
