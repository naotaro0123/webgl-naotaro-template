import WebGLRenderer from './DrawElements';
const CANVAS_SIZE = 400;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('glcanvas');
  canvas.width = canvas.height = CANVAS_SIZE;

  new WebGLRenderer(canvas);
});
