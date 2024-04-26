class PointLight{
    constructor(diffuse, ambient, specular, position){
        this.diffuse = diffuse;
        this.ambient = ambient;
        this.specular= specular;
        this.light_pos = position;
        
        // this.diffuse = vec3(1.0, 0.05, 0.05);
        // this.ambient = vec3(0.5, 0.5, 0.5);
        // this.specular = vec3(1.0, 1.0, 1.0);
        // this.light_pos = vec3(1.0, 2.0, 3,0);
    }

    getLightPosInCamCoordinates(cam){
        var result =  mult(cam.getModelViewMatrix() , vec4(this.light_pos[0],this.light_pos[1],this.light_pos[2], 1.0 ));
        return vec3(result[0], result[1], result[2]);
    }

    updatePos(newPos){
        this.light_pos = newPos;
    }

    getDiffuse(){
        return this.diffuse;    
    }

    getAmbient(){
        return this.ambient;
    }

    getSpecular(){
        return this.specular;
    }

    getPosition(){
        return this.light_pos;
    }

}

class PointLightCyl extends Camera {
    constructor(program, diffuse, ambient, specular, position){
        super();
        this.program = program;
        this.pointLight = new PointLight(diffuse, ambient, specular, position);
    }

    updatePos(newPos){
        this.pointLight.updatePos(newPos);
    }

    getDiffuse(){
        return this.pointLight.getDiffuse(newPos);
    }

    getAmbient(){
        return this.pointLight.getAmbient(newPos);
    }

    getSpecular(){
        return this.pointLight.getSpecular(newPos);
        
    }

    getPosition(){
        return this.pointLight.getPosition(newPos);
    }

    addCameraKeystrokeListener(){
        // Keystroke listener
        window.addEventListener("keydown", function() {
            var ignoreRender = false;
            console.log(String.fromCharCode(event.keyCode), event.keyCode)
            switch (event.keyCode) {
                
                case 79: // ’o’ inc radius
                    this.incRadius();
                    break;
                
                case 80: // ’p’ Dec radius
                    this.decRadius();
                    break;
    
                case 81: // ’q’ increase height
                    this.incHeight();
                    break;
    
                case 87: // ’w’ decrease height
                    this.decHeight();
                    break;  
    
                case 88: // ’x’ rotate left
                    this.decTheta();
                    break;
    
                case 67: // ’c’ rotate right
                    this.incTheta();
                   
                break;
                    
            default:
                break;
            }
            
            if (!ignoreRender){
                smfShape1.draw()
            }
    
        });
        
    }




}

