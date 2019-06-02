const navbarBurger = document.getElementById('navbar-burger');
const navigations = document.getElementById('navigations');
const activeLink = document.getElementsByClassName('active-link')[0];
const imageButton = document.getElementById('image-button');
const imageUpload = document.getElementById('imageUpload');
const transSelect = document.getElementById('transSelect');
const brandSelect = document.getElementById('brandSelect');
const colourSelect = document.getElementById('colourSelect');
const transmissions = ['automatic', 'manual'];
const brands = ['Toyota', 'Kia', 'Hyundai', 'Nissan', 'Audi', 'BMW',
  'Mercedes-Benz', 'Volkswagen', 'Ford', 'Jeep', 'Range Rover',
  'Land Rover', 'Honda', 'Lexus', 'Infiniti', 'Acura', 'Chevrolet',
  'Mazda', 'Mitsubishi', 'Peugeot', 'Suzuki', 'Volvo'];
const colours = ['Black', 'Whi1te', 'Silver', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Others'];
let i = 0;

if (brandSelect !== undefined) {
  for (i = 0; i < brands.length; i += 1) {
    brandSelect.innerHTML += `<option>${brands[i]}</option>`;
  }
}

if (transSelect !== undefined) {
  for (i = 0; i < transmissions.length; i += 1) {
    transSelect.innerHTML += `<option>${transmissions[i]}</option>`;
  }
}

if (colourSelect !== undefined) {
  for (i = 0; i < colours.length; i += 1) {
    colourSelect.innerHTML += `<option>${colours[i]}</option>`;
  }
}

navbarBurger.addEventListener('click', () => {
  navigations.classList.toggle('navbar-hidden');
  activeLink.classList.toggle('active-link');
});

imageButton.addEventListener('click', () => {
  imageUpload.click();
});
