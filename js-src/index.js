import { loadAndCompileShader } from "./utils/index";

const setupWebGL = () => {
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
      gl_Position = vec4(clip_space,0,1);
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
  var positions = [0, 0, 10, 10, 10, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  var size = 2;
  var type = gl.FLOAT;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, false, 0, 0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

window.onload = setupWebGL;
