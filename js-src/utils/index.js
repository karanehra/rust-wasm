/**
 * Loads and compiles shaders
 * @param {WebGLRenderingContext} gl The context
 * @param {String} type type
 * @param {Source} source source
 */
export const loadAndCompileShader = (gl, type, source) => {
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
