class Shape3D {
    constructor(shaderProgram, material, vertexList = null, faceList = null) {
        this.program = shaderProgram;
        this.material = material;
        this.inVertexList = (vertexList === null) ? [] : vertexList;
        this.inFaceList = (faceList === null) ? [] : faceList;
        this.camera = null;
        this.centroid = null;
        // this.material = null;

        this.vertex = [];
        this.normal = [];
        // console.log(material);

    }

    initializeInputs() {
        this.calculateCentroid();
        this.processFaces();

        //  Load shaders and initialize attribute buffers
        canvas = document.getElementById("gl-canvas");
        gl = canvas.getContext('webgl2');

        // this.program = initShaders(gl, "./shaderPrograms/vshader.glsl", "./shaderPrograms/fshader.glsl");
        gl.useProgram(this.program);

        this.cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normal), gl.STATIC_DRAW);

        this.normalLoc = gl.getAttribLocation(this.program, "aNormal");
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);

        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertex), gl.STATIC_DRAW);


        this.positionLoc = gl.getAttribLocation(this.program, "aPosition");
        gl.vertexAttribPointer(this.positionLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLoc);

        // this.xformLoc = gl.getUniformLocation(this.program, "u_xform_mat");
        this.modelViewMatrixLoc = gl.getUniformLocation(this.program, "modelViewMatrix");
        this.projectionMatrixLoc = gl.getUniformLocation(this.program, "projectionMatrix");

    }

    processFaces() {
        var vertexNs = [];
        for (var i = 0; i < this.inVertexList.length; i++) { vertexNs.push([]) }

        for (var i = 0; i < this.inFaceList.length; ++i) {
            var fNormal = this.calculateNormalCorlor(this.inFaceList[i]);

            // Add face normal to associated vertex list

            for (var v = 0; v < 3; v++) {
                this.vertex.push(this.inVertexList[this.inFaceList[i][v] - 1]);
                // console.log("vertexNs:",vertexNs)
                vertexNs[this.inFaceList[i][v] - 1].push(fNormal)
                // this.normal.push(fNormal);
            }
        }

        // Calculate avg normal per vertex
        for (var i = 0; i < vertexNs.length; i++) {
            // var vsum = [0,0,0];
            var vsum = vec3();
            vertexNs[i].forEach(element => {
                // if (vsum === -1){
                //     vsum = element;
                // } else {
                vsum = add(element, vsum)
                // }
                // vsum[0] += element[0];
                // vsum[1] += element[1];
                // vsum[2] += element[2];
            });

            // vsum = vec3(vsum[0]/vertexNs[i].length, vsum[1]/vertexNs[i].length, vsum[2]/vertexNs[i].length );
            // console.log("vusm",vsum)
            vsum = normalize(vsum);
            vertexNs[i] = vsum
        }
        // console.log("vetexN", vertexNs)

        // Add normals to draw
        var temp = [];
        for (var i = 0; i < this.inFaceList.length; ++i) {
            // var fNormal = this.calculateNormalCorlor(this.inFaceList[i]);

            // Add face normal to associated vertex list

            for (var v = 0; v < 3; v++) {
                // this.vertex.push( this.inVertexList[this.inFaceList[i][v] - 1]);
                // console.log("vertexNs:",vertexNs)
                // vertexNs[this.inFaceList[i][v] - 1].push(fNormal)
                this.normal.push(vertexNs[this.inFaceList[i][v] - 1]);
                // temp.push(vertexNs [this.inFaceList[i][v] - 1]);
                // this.normal.push(this.inFaceList[i][v] - 1);
            }
        }
        // console.log(this.vertex.length)
        // console.log(this.normal.length);
        // console.log("temp", temp);






        // console.log("vertexN", vertexNs)
        // console.log("vetex", this.inVertexList.length)

    }

    draw(spotlight) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // var xform_mat =  mat4();
        // gl.uniformMatrix4fv(this.xformLoc, false, flatten(xform_mat));

        // Update Camera and set uniforms
        this.camera.updateCamera();

        gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, flatten(this.camera.getModelViewMatrix()));
        gl.uniformMatrix4fv(this.projectionMatrixLoc, false, flatten(this.camera.getProjectionMatrix()));


        // Shader Program -----------------------------------------------
        var ambientProduct = mult(this.camera.pointLight.getAmbient(), this.material.getAmbient());
        // var diffuseProduct = mult(this.camera.pointLight.getDiffuse(), this.material.getDiffuse());
        var specularProduct = mult(this.camera.pointLight.getSpecular(), this.material.getSpecular());
        // var lightPosition = mult(this.camera.getModelViewMatrix())

        gl.uniform3fv(gl.getUniformLocation(this.program, "ambientProduct"), flatten(ambientProduct));
        // gl.uniform3fv(gl.getUniformLocation(this.program, "diffuseProduct"), flatten(diffuseProduct) );
        gl.uniform3fv(gl.getUniformLocation(this.program, "specularProduct"), flatten(specularProduct));
        gl.uniform3fv(gl.getUniformLocation(this.program, "lightPosition"), flatten(this.camera.pointLight.getLightPosInCamCoordinates(this.camera)));
        // gl.uniform3fv(gl.getUniformLocation(this.program, "lightPosition"), flatten(this.camera.pointLight.getPosition()));
        gl.uniform1f(gl.getUniformLocation(this.program, "shininess"), this.material.getShininess());
        // --------------------------------------------------------------

        // Draw Arrays
        gl.drawArrays(gl.TRIANGLES, 0, this.vertex.length)

    }

    calculateNormalCorlor(currentFace) {
        var p0 = this.inVertexList[currentFace[0] - 1];
        var p1 = this.inVertexList[currentFace[1] - 1];
        var p2 = this.inVertexList[currentFace[2] - 1];
        var v1 = subtract(p1, p0);
        var v2 = subtract(p2, p0);
        var n = cross(v1, v2);

        var N = normalize(n);
        // return vec3(N[0], N[1], N[2])
        return N;
    }

    setCamera(newCam) {
        this.camera = newCam;
    }

    calculateCentroid() {
        var l = this.inVertexList.length;
        var sumList = vec3();

        for (let i = 0; i < l; i++) {
            sumList = add(sumList, this.inVertexList[i])
        }

        var result = vec3();

        result[0] = sumList[0] / l;
        result[1] = sumList[1] / l;
        result[2] = sumList[2] / l;

        this.centroid = result;
    }

    getCentroid() {
        return this.centroid;
    }

    getOutVertex() { return this.vertex; }

    getOutNormals() { return this.normal; }
}


class CubeStatic {

    static VEXTEX_POSITIONS = [
        vec3(0, -0.5, 0.5),
        vec3(0, 0.5, 0.5),
        vec3(1, 0.5, 0.5),
        vec3(1, -0.5, 0.5),
        vec3(0, -0.5, -0.5),
        vec3(0, 0.5, -0.5),
        vec3(1, 0.5, -0.5),
        vec3(1, -0.5, -0.5)
    ];

    static cubeFaces() {
        var triagnleFaces = [];
        var cubeFaces = [
            [1, 4, 3, 2],    // front
            [3, 4, 8, 7],    // right
            [1, 5, 8, 4],    // bottom
            [2, 3, 7, 6],    // top
            [5, 6, 7, 8],    // back
            [1, 2, 6, 5]     // left
        ];

        cubeFaces.forEach(quad => {

            triagnleFaces.push([quad[0], quad[1], quad[2]]);
            triagnleFaces.push([quad[0], quad[2], quad[3]]);

        });

        return triagnleFaces;
    }
}

class PlaneStatic {

    static VEXTEX_POSITIONS = [
        vec3(-1, -0.5, 1),     //1
        vec3(1, -0.5, 1),     //4
        vec3(-1, -0.5, -1),    //5
        vec3(1, -0.5, -1)     //8
    ];

    static getPlaneFace() {
        var triagnleFaces = [];
        var planeFace = [
            [1, 2, 4, 3],    // bottom
        ];

        planeFace.forEach(quad => {

            triagnleFaces.push([quad[0], quad[1], quad[2]]);
            triagnleFaces.push([quad[0], quad[2], quad[3]]);

        });

        return triagnleFaces;
    }
}