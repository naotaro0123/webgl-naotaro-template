import WebGLRenderer from './WebGLRenderer';
const CANVAS_SIZE = 400;

// reference Site https://wgld.org/d/webgl/w015.html
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('glcanvas');
  canvas.width = canvas.height = CANVAS_SIZE;

  new WebGLRenderer(canvas);
});
