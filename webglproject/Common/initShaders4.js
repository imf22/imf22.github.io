async function loadShaderFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(response);
            throw new Error(`Failed to load shader file: ${url}`);
        }
        return response.text();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function initShaders(gl, vertexShaderUrl, fragmentShaderUrl) {
    const vertSource = await loadShaderFile(vertexShaderUrl);
    const fragSource = await loadShaderFile(fragmentShaderUrl);

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertSource);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile vertex shader: ${gl.getShaderInfoLog(vertShader)}`);
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragSource);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile fragment shader: ${gl.getShaderInfoLog(fragShader)}`);
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Could not link shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }

    return shaderProgram;
}
