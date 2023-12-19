    // This carousel we functions by hiding the all image 
    // DOM elements except the focused image.
    // Images are dectected in the images div in the html
    // new images can be added and changed there.
document.querySelectorAll('.carousel').forEach(carousel => {
    const images = carousel.querySelector('.images');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    
    let imageIndex = 0;
    const totalImages = images.children.length;
    const shiftY = Math.floor(100 / totalImages);

    const childElements = images.querySelectorAll('img');
    let childArray = [];

    for (let i = 0; i < childElements.length; i++) {
      const childElement = childElements[i];

      childElement.style.display = 'none';

      childArray.push(childElement);
    }

    prevButton.addEventListener('click', () => {
      childArray[imageIndex].style.display ='none';
      imageIndex = (imageIndex - 1 + totalImages) % totalImages;
      updateImage();
    });

    nextButton.addEventListener('click', () => {
      childArray[imageIndex].style.display ='none';
      imageIndex = (imageIndex + 1) % totalImages;
      updateImage();
    });

    function updateImage() {
        images.classList.add('image-fade');
        setTimeout(() => {
           images.classList.remove('image-fade') ;
        }, 550);
        
        childArray[imageIndex].style.display ='flex';
      
    }

    updateImage();

});