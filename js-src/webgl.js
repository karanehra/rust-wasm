const main = () => {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("main");
  let gl = canvas.getContext("webgl");
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  initializeShaders(gl);
};

const vertexShaderSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(0, 1.0, 1.0, 1.0);
  }
`;

/**
 *
 * @param {WebGLRenderingContext} gl
 */
const initializeShaders = (gl) => {
  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const shaderProg = gl.createProgram();
  gl.attachShader(shaderProg, vertexShader);
  gl.attachShader(shaderProg, fragmentShader);
  gl.linkProgram(shaderProg);
  if (!gl.getProgramParameter(shaderProg, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProg)
    );
    return null;
  }

  return shaderProg;
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} type
 * @param {*} source
 */
const loadShader = (gl, type, source) => {
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

export default main;
