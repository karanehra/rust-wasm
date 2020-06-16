/**
 * Loads and compiles shaders
 * @param {WebGLRenderingContext} gl The context
 * @param {String} type type
 * @param {Source} source source
 */
const loadAndCompileShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export const setupWebGL = () => {
  /**
   * @type {HTMLCanvasElement}
   */
  let map = document.getElementById("map");
  const gl = map.getContext("webgl");

  if (!gl) {
    console.log("WebGL not availabel");
    return;
  }

  const vsSource = `
    attribute vec2 a_position;

    uniform vec2 u_resolution;

    void main() {
      vec2 normalized = a_position/u_resolution;

      vec2 clip_space = (normalized * 2.0) - 1.0;
      gl_Position = vec4(clip_space*vec2(1,-1),0,1);
    }
  `;

  const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
  }
`;

  const vertexShader = loadAndCompileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadAndCompileShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  const width = map.clientWidth;
  const height = map.clientHeight;
  if (map.width !== width || map.height !== height) {
    map.width = width;
    map.height = height;
  }

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  let positionsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  var size = 2;
  var type = gl.FLOAT;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, false, 0, 0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  return gl;
};

/**
 *
 * @param {WebGLRenderingContext} gl The context
 * @param {Number} x The top-left vertex x
 * @param {Number} y The top-left vertex y
 * @param {Number} w Width of rect
 * @param {Number} h Height of rect
 */
export const drawRectangle = (gl, x, y, w, h) => {
  let x1 = x;
  let y1 = y;
  let x2 = x + w;
  let y2 = x + h;
  let points = [x1, y1, x1, y2, x2, y2, x2, y2, x2, y1, x1, y1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};
