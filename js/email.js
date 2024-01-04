// Get the button and the email box element by their IDs
const revealButton = document.getElementById('sendMailButton');
const emailBox = document.getElementById('emailBox');

// Add an event listener to the button for the click event
revealButton.addEventListener('click', function() {
  // Change the display property to flex
  emailBox.style.display = 'flex';
});

function closeEmailBox() {
    const emailBox = document.getElementById('emailBox');
    emailBox.style.display = 'none'; // Hide the email box when the X is clicked
  }
  