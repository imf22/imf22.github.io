let currentArmKeyboardControlsIndex = 0;
let slider1, slider2, slider3;

function addArmMenuListener() {
    // Menu listener

    // var m = document.getElementById("robotPart");
    // m.addEventListener("click", function () {
    //     currentArm = allParts[m.selectedIndex + 2];
    //     var t = document.getElementById("currentText");
    //     t.innerText = "Controlling Arm " + (m.selectedIndex + 1)
    // });


    slider1 = document.getElementById("sliderArm1");
    slider2 = document.getElementById("sliderArm2");
    slider3 = document.getElementById("sliderArm3");

    slider1.oninput = () => updateArm1(slider1.value);
    slider2.oninput = () => updateArm2(slider2.value);
    slider3.oninput = () => updateArm3(slider3.value);


}

function addArmKeystrokeListener() {
    // Keystroke listener
    window.addEventListener("keydown", function () {
        // "J: 74", "K: 75", "U: 85", "I: 73"
        var ignoreRender = false;
        // console.log(String.fromCharCode(event.keyCode), event.keyCode);
        switch (this.event.keyCode) {
            case 74:
                decArm();
                break;
            case 75:
                incArm();
                break;
            case 73:
                setArmToNext();
                break;
            case 85: 
                setArmToPrev();
                break;

            default:
                ignoreRender = true;
                break;
        }

        if (!ignoreRender) {
            updateRobotComponents();
            drawAllShapes();
        }
    })
}

function setArmToPrev(){
    currentArmKeyboardControlsIndex === 0
    ? currentArmKeyboardControlsIndex = 2
    : currentArmKeyboardControlsIndex -= 1;
    currentArm = allParts[currentArmKeyboardControlsIndex + 2];

    var t = document.getElementById("currentText");
    t.innerText = "Controlling Arm " + (currentArmKeyboardControlsIndex + 1)
}
function setArmToNext(){
    currentArmKeyboardControlsIndex === 2
    ? currentArmKeyboardControlsIndex = 0
    : currentArmKeyboardControlsIndex += 1;
    currentArm = allParts[currentArmKeyboardControlsIndex + 2];

    var t = document.getElementById("currentText");
    t.innerText = "Controlling Arm " + (currentArmKeyboardControlsIndex + 1)
}

// incArm() and decArm() we used in the original keyboard based interactions
function incArm() {
    // console.log("Increasing Arm");

    var curT;
    switch (currentArm) {
        case arm1:
            curT = currentArm.transform.getTheta();
            curT[1] += 2;
            currentArm.transform.setTheta(curT);
            slider1.value = curT[1];
            break;
        case arm2:
            curT = currentArm.transform.getTheta();

            if (curT[1] < 163) {
                curT[1] += 2;
                currentArm.transform.setTheta(curT);
                slider2.value = curT[1];
            }
            break;
        case arm3:
            curT = currentArm.transform.getOffset();
            if (curT[1] < 0.18) {
                curT[1] += 0.005;
                currentArm.transform.setOffset(curT);
                slider3.value = Math.round(curT[1] * 1000); //Scale value back up 
            }
            break;
    }
}

function decArm() {
    // console.log("Decresing Arm");

    var curT;
    switch (currentArm) {
        case arm1:
            curT = currentArm.transform.getTheta();
            curT[1] -= 2;
            currentArm.transform.setTheta(curT);
            slider1.value = curT[1];
            break;
        case arm2:
            curT = currentArm.transform.getTheta();
            if (curT[1] > -163) {
                curT[1] -= 2;
                currentArm.transform.setTheta(curT);
                slider2.value = curT[1];
            }
            break;
        case arm3:
            curT = currentArm.transform.getOffset();
            if (curT[1] > -0.180) {
                curT[1] -= 0.005;
                currentArm.transform.setOffset(curT);
                slider3.value = Math.round(curT[1] * 1000); //Scale value back up 
            }
            break;
    }
}

// Slider based interactivity
// Arm Components are begin at index 2
// Arm limits:
// Arm 1: None
// Arm 2: [-163, 163]
// Arm 3: [-0.18, 0.18]
// Limits are applied directly on html sliders

function updateArm1(newTheta){
    // console.log(newTheta);
    currentArm = allParts[2]

    var newTransform = currentArm.transform.getTheta();
    newTransform[1] = newTheta;
    currentArm.transform.setTheta(newTransform);

    // console.log("Current Theta: ", currentArm.transform.getTheta());

    updateRobotComponents();
    drawAllShapes();
}

function updateArm2(newTheta){
    console.log(newTheta);
    currentArm = allParts[3]
    
    var newTransform = currentArm.transform.getTheta();
    newTransform[1] = newTheta;
    currentArm.transform.setTheta(newTransform);

    updateRobotComponents();
    drawAllShapes();
}

function updateArm3(newHeight){
    currentArm = allParts[4]
    let newHeightHundreths = newHeight * 0.001;
    console.log(newHeightHundreths);

    var newTransform = currentArm.transform.getOffset();
    newTransform[1] = newHeightHundreths;
    currentArm.transform.setOffset(newTransform);

    updateRobotComponents();
    drawAllShapes();
}