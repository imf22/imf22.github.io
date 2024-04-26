class Material{
    constructor(diffuse, ambient, specular, shininess){
        this.diffuse = diffuse;
        this.ambient = ambient;
        this.specular= specular;
        this.shininess= shininess;
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

    getShininess(){
        return this.shininess;
    }

}