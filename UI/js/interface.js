const navbarBurger = document.getElementById('navbar-burger');
const navigations = document.getElementById('navigations');
const navLinks = document.getElementsByClassName('nav-links');

navbarBurger.addEventListener('click', () => {
  navigations.classList.toggle('navbar-hidden');
  navLinks.classList.toggle('active-link');
});
