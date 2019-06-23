import { mat4 } from 'gl-matrix';
import vertexShaderSource from './shader/vertexShader.vert';
import fragmentShaderSource from './shader/fragmentShader.frag';

// reference Site https://wgld.org/d/webgl/w018.html
class DrawElements {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = this.canvas.getContext('webgl');
    this.clear();
    this.init();
    this.counter = 0;
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

    const vertexPosition = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0, 0.0];
    const vertexColor = [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
    this.vertexIndex = [0, 1, 2, 1, 2, 3];

    const positionVbo = this.createVbo(vertexPosition);
    const colorVbo = this.createVbo(vertexColor);
    this.setAttribute([positionVbo, colorVbo], attLocation, attStride);

    const ibo = this.createIbo(this.vertexIndex);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);

    this.uniLocation = this.gl.getUniformLocation(program, 'mvpMatrix');

    this.mMatrix = mat4.identity(mat4.create());
    this.vMatrix = mat4.identity(mat4.create());
    this.pMatrix = mat4.identity(mat4.create());
    this.tmpMatrix = mat4.identity(mat4.create());
    this.mvpMatrix = mat4.identity(mat4.create());

    mat4.lookAt(this.vMatrix, [0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    mat4.perspective(this.pMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 100);
    mat4.multiply(this.tmpMatrix, this.pMatrix, this.vMatrix);

    this.render();
  }

  createShader(type, source) {
    let shaderType = '';
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

  createIbo(data) {
    const ibo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }

  setAttribute(vbo, attL, attS) {
    vbo.forEach((value, index) => {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[index]);
      this.gl.enableVertexAttribArray(attL[index]);
      this.gl.vertexAttribPointer(attL[index], attS[index], this.gl.FLOAT, false, 0, 0);
    });
  }

  render() {
    this.clear();

    this.counter++;
    const rad = ((this.counter % 360) * Math.PI) / 180;
    mat4.identity(this.mMatrix);
    mat4.rotate(this.mMatrix, this.tmpMatrix, rad, [0, 1, 0]);
    mat4.multiply(this.mvpMatrix, this.tmpMatrix, this.mMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation, false, this.mvpMatrix);
    this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndex.length, this.gl.UNSIGNED_SHORT, 0);
    this.gl.flush();
    requestAnimationFrame(() => this.render());
  }
}

export default DrawElements;
