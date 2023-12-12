// This carousel was modified to instead use backgroundImage to display
// the focused image.
// Images are managed through the html. Each img DOM src is stored 
// and used to change the focused image. 
document.querySelectorAll('.carousel').forEach(carousel => {
    const images = carousel.querySelector('.images');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    
    
    let imageIndex = 0;
    const totalImages = images.children.length;

    const childElements = images.querySelectorAll('img');
    let childArray = [];

    for (let i = 0; i < childElements.length; i++) {
      const childElement = childElements[i];

      childElement.style.display = 'none';

      childArray.push(childElement);
    }

    prevButton.addEventListener('click', () => {
      imageIndex = (imageIndex - 1 + totalImages) % totalImages;
      updateImage();
    });

    nextButton.addEventListener('click', () => {
      imageIndex = (imageIndex + 1) % totalImages;
      updateImage();
    });

    function updateImage() {
        images.classList.add('image-fade');
        setTimeout(() => {
           images.classList.remove('image-fade') ;
        }, 550);
        carousel.style.backgroundImage = `url(${childArray[imageIndex].getAttribute('src')})`;
    }

  });