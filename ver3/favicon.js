const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const favicon = document.getElementById('favicon');
if (prefersDarkMode) {
  favicon.href = 'favicon_dark.png'; 
}
