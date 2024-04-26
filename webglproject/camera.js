class Camera {
    constructor() {
        this.lookingAt = null;
        this.radius = 2;
        this.theta = 90;
        this.height = 1.0;
        this.isOrtho = false;
        this.addPointLight();
        this.addCameraKeystrokeListener(this);
        this.addPerspectiveButtonEvent(this);
    }
    addPointLight() {
        var eye = vec3(this.radius * Math.cos(this.theta * Math.PI / 180),
            this.height,
            this.radius * Math.sin(this.theta * Math.PI / 180));

        this.pointLight = new PointLight(
            vec3(1.0, 1.0, 1.0),
            vec3(0.5, 0.5, 0.5),
            vec3(0.4, 0.6, 0.2),
            eye);
    }

    updateCamera() {

        var fovy = 70;
        var aspect = 1.0;
        var near = 0.01
        var far = 30

        var eye = vec3(this.radius * Math.cos(this.theta * Math.PI / 180),
            this.height,
            this.radius * Math.sin(this.theta * Math.PI / 180))

        var at = add(this.lookingAt.getCentroid(), vec3(-0.5, 0, 0));

        var up = vec3(0.0, 1.0, 0.0)

        var atOrtho = vec3(0, -0.5, 0)
        var upOrtho = vec3(0.0, 0.75, 0.0)
        var l = 9;


        // this.modelViewMatrix = lookAt(eye, at, up);


        if (this.isOrtho) {

            this.modelViewMatrix = lookAt(mult(0.5, eye), atOrtho, upOrtho);
            this.projectionMatrix = ortho(-1*l, l, -1* l, l, -1*l, l);
            // this.projectionMatrix = ortho(bBox[0], bBox[3], bBox[2], bBox[4], bBox[2], bBox[5]);

        } else {
            this.modelViewMatrix = lookAt(eye, at, up);
            this.projectionMatrix = perspective(fovy, aspect, near, far);
        }

        this.pointLight.updatePos(eye);

    }

    getModelViewMatrix() {
        return this.modelViewMatrix;
    }

    getProjectionMatrix() {
        return this.projectionMatrix;
    }

    setLookAt(newTarget) {
        this.lookingAt = newTarget;
        this.updateCamera()
    }

    toggleIsOrtho() {
        this.isOrtho = !this.isOrtho;
        this.updateCamera();
    }

    incRadius() {
        if (this.radius < 10.0) {
            console.log("Inc Radius");
            this.radius += 0.05;
            this.updateCamera();
        }
    }

    decRadius() {
        if (this.radius > 0.0) {
            console.log("Dec Radius");
            this.radius -= 0.05;
            this.updateCamera();
        }
    }

    incHeight() {
        console.log("Inc Height");
        this.height += 0.05
        this.updateCamera();
    }

    decHeight() {
        console.log("Dec Height");
        this.height -= 0.05
        this.updateCamera();
    }

    incTheta() {
        // if ( this.theta < 180){
        //     console.log("Inc Theta");
        this.theta += 1;
        this.updateCamera();
        // };
    }
    decTheta() {
        // if ( this.theta > -180){
        //     console.log("Dec Theta");
        this.theta -= 1;
        this.updateCamera();
        // }; 
    }

    addCameraKeystrokeListener(cam) {
        // Keystroke listener
        //  "Q: 81", "W: 87", "E: 69", 
        //  "A: 65", "S: 83", "D: 68",
        window.addEventListener("keydown", function () {
            var ignoreRender = false;
            // console.log(String.fromCharCode(event.keyCode), event.keyCode)
            switch (event.keyCode) {

                case 87: // ’W’ inc radius
                    cam.decRadius();
                    break;

                case 83: // ’S’ Dec radius
                    cam.incRadius();
                    break;

                case 81: // ’Q’ increase height
                    cam.incHeight();
                    break;

                case 69: // ’E’ decrease height
                    cam.decHeight();
                    break;

                case 65: // ’A’ rotate left
                    cam.decTheta();
                    break;

                case 68: // ’D’ rotate right
                    cam.incTheta();

                    break;

                default:
                    ignoreRender = true;
                    break;
            }

            if (!ignoreRender) {
                drawAllShapes()
            }

        });
    }

    addPerspectiveButtonEvent(cam) {
        var button = document.getElementById("projection");

        button.addEventListener("click", function () {
            cam.toggleIsOrtho();
            console.log("Toggle Perspective")
            // shape.draw();
            // drawToProgram();
            drawAllShapes();
        })
    }
}
