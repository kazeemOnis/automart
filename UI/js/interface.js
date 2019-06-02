const navbarBurger = document.getElementById('navbar-burger');
const navigations = document.getElementById('navigations');
const activeLink = document.getElementsByClassName('active-link')[0];
const imageButton = document.getElementById('image-button');
const imageUpload = document.getElementById('imageUpload');

navbarBurger.addEventListener('click', () => {
  navigations.classList.toggle('navbar-hidden');
  activeLink.classList.toggle('active-link');
});

imageButton.addEventListener('click', () => {
  imageUpload.click();
});
