import { mat4 } from 'gl-matrix';
const vertexShaderSource = require('./shader/vertexShader.vert');
const fragmentShaderSource = require('./shader/fragmentShader.frag');

// reference Site https://wgld.org/d/webgl/w015.html
class DrawArrays {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = this.canvas.getContext('webgl');
    this.clear();
    this.init();
  }

  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  init() {
    const vertexShader = this.createShader('vertex', vertexShaderSource);
    const fragmentShader = this.createShader('fragment', fragmentShaderSource);
    const program = this.createProgram(vertexShader, fragmentShader);

    let attLocation = new Array(2);
    attLocation[0] = this.gl.getAttribLocation(program, 'position');
    attLocation[1] = this.gl.getAttribLocation(program, 'color');

    let attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;

    const vertexPosition = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0];
    const vertexColor = [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0];

    const positionVbo = this.createVbo(vertexPosition);
    const colorVbo = this.createVbo(vertexColor);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionVbo);
    this.gl.enableVertexAttribArray(attLocation[0]);
    this.gl.vertexAttribPointer(attLocation[0], attStride[0], this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorVbo);
    this.gl.enableVertexAttribArray(attLocation[1]);
    this.gl.vertexAttribPointer(attLocation[1], attStride[1], this.gl.FLOAT, false, 0, 0);

    const mMatrix = mat4.identity(mat4.create());
    const vMatrix = mat4.identity(mat4.create());
    const pMatrix = mat4.identity(mat4.create());
    const mvpMatrix = mat4.identity(mat4.create());

    mat4.lookAt(vMatrix, [0.0, 1.0, 3.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.perspective(pMatrix, 90, this.canvas.width / this.canvas.height, 0.1, 100);
    mat4.multiply(mvpMatrix, pMatrix, vMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, mMatrix);

    const uniLocation = this.gl.getUniformLocation(program, 'mvpMatrix');
    this.gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    this.gl.flush();
  }

  createShader(type, source) {
    let shaderType: number;
    switch (type) {
      case 'vertex':
        shaderType = this.gl.VERTEX_SHADER;
        break;
      case 'fragment':
        shaderType = this.gl.FRAGMENT_SHADER;
        break;
    }
    const shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.error(this.gl.getShaderInfoLog(shader));
    }
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      this.gl.useProgram(program);
      return program;
    } else {
      console.error(this.gl.getProgramInfoLog(program));
    }
  }

  createVbo(data) {
    const vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    return vbo;
  }
}

export default DrawArrays;
