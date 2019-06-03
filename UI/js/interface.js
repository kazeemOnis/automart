const navbarBurger = document.getElementById('navbar-burger');
const navigations = document.getElementById('navigations');
const activeLink = document.getElementsByClassName('active-link')[0];
const imageButton = document.getElementById('image-button');
const imageUpload = document.getElementById('imageUpload');
const transSelect = document.getElementById('transSelect');
const brandSelect = document.getElementById('brandSelect');
const colourSelect = document.getElementById('colourSelect');
const condSelect = document.getElementById('condSelect');
const priceSelect = document.getElementById('priceSelect');
const priceOptions = ['&#8358;0 - &#8358;999,999', '&#8358;1,000,000 - &#8358;1,999,999',
  '&#8358;2,000,000 - &#8358;4,999,999', '&#8358;5,000,000 +'];
const transmissions = ['Automatic', 'Manual'];
const conditions = ['New', 'Used'];
const brands = ['Toyota', 'Kia', 'Hyundai', 'Nissan', 'Audi', 'BMW',
  'Mercedes-Benz', 'Volkswagen', 'Ford', 'Jeep', 'Range Rover',
  'Land Rover', 'Honda', 'Lexus', 'Infiniti', 'Acura', 'Chevrolet',
  'Mazda', 'Mitsubishi', 'Peugeot', 'Suzuki', 'Volvo'];
const colours = ['Black', 'Whi1te', 'Silver', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Others'];
let i = 0;

if (brandSelect !== null) {
  for (i = 0; i < brands.length; i += 1) {
    brandSelect.innerHTML += `<option>${brands[i]}</option>`;
  }
}

if (transSelect !== null) {
  for (i = 0; i < transmissions.length; i += 1) {
    transSelect.innerHTML += `<option>${transmissions[i]}</option>`;
  }
}

if (colourSelect !== null) {
  for (i = 0; i < colours.length; i += 1) {
    colourSelect.innerHTML += `<option>${colours[i]}</option>`;
  }
}

if (condSelect !== null) {
  for (i = 0; i < conditions.length; i += 1) {
    condSelect.innerHTML += `<option>${conditions[i]}</option>`;
  }
}

if (priceSelect !== null) {
  for (i = 0; i < priceOptions.length; i += 1) {
    condSelect.innerHTML += `<option>${priceOptions[i]}</option>`;
  }
}

navbarBurger.addEventListener('click', () => {
  navigations.classList.toggle('navbar-hidden');
  activeLink.classList.toggle('active-link');
});

if (imageButton !== null) {
  imageButton.addEventListener('click', () => {
    imageUpload.click();
  });
}
