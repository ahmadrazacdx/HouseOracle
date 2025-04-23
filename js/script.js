// To handle Navbar Toggler 
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dropdown-toggle").forEach(function (dropdown) {
        dropdown.addEventListener("click", function (event) {
            let dropdownMenu = this.nextElementSibling;
            if (dropdownMenu.classList.contains("show")) {
                event.stopPropagation(); 
                bootstrap.Dropdown.getInstance(this).hide();
            }
        });
    });
});

const provCities = {
  "Islamabad Capital": ["Islamabad"],
  "Punjab": ["Rawalpindi", "Faisalabad", "Lahore"],
  "Sindh": ["Karachi"]
};

const cityLocations = {
  "Islamabad": ["E-11", "F-7", "F-8", "F-10", "F-11", "G-11", "G-13", "DHA Defence Islamabad", "others"],
  "Rawalpindi": ["Bahria Town Rawalpindi", "Adiala Road", "Gulraiz Housing Scheme", "Airport Housing Society", "Satellite Town", "others"],
  "Karachi": ["DHA Defence Karachi", "Gulistan-e-Jauhar", "Gulshan-e-Iqbal Town", "North Nazimabad", "Bahria Town Karachi", "Jamshed Town", "others"],
  "Faisalabad": ["Canal Road", "Satiana Road", "Eden Valley", "Madina Town", "Eden Gardens", "Wapda Town", "others"],
  "Lahore": ["DHA Defence Lahore", "Bahria Town Lahore", "Johar Town", "Allama Iqbal Town", "Askari", "Model Town", "Gulberg", "Media Town", "others"],
};

const provinceDropdown = document.getElementById('provinceDropdown');
const cityDropdown = document.getElementById('cityDropDown');
const locationDropdown = document.getElementById('locationDropdown');

function initializeProvinces() {
  provinceDropdown.innerHTML = '<option value="">Select Province</option>';
  Object.keys(provCities).forEach(province => {
      provinceDropdown.add(new Option(province, province));
  });
}
function handleCityPopulation() {
  const selectedProvince = provinceDropdown.value;
  const purpose = document.getElementById('purposeDropdown').value;
  cityDropdown.innerHTML = '<option value="">Select City</option>';

  let cities = selectedProvince 
      ? provCities[selectedProvince] 
      : [...new Set(Object.values(provCities).flat())];

  if (purpose === 'rent') {
    cities = cities.filter(city => city !== 'Lahore');
  }

  cities.forEach(city => {
      cityDropdown.add(new Option(city, city));
  });
  
  if (cities.includes(cityDropdown.value)) {
      cityDropdown.value = cityDropdown.value;
  } else {
      cityDropdown.value = "";
  }
}
  document.getElementById('purposeDropdown').addEventListener('change', () => {
    handleCityPopulation();
    updateLocations();
  });

// location handler 
function updateLocations() {
  const selectedCity = cityDropdown.value;
  locationDropdown.innerHTML = '<option value="">Select Location</option>';
  
  const locations = selectedCity 
      ? cityLocations[selectedCity] 
      : [...new Set(Object.values(cityLocations).flat().filter(loc => loc !== 'others'))].concat('others');

  locations.forEach(location => {
      locationDropdown.add(new Option(location, location));
  });
}

if (provinceDropdown && cityDropdown && locationDropdown) {
  initializeProvinces();
  handleCityPopulation();
  updateLocations();
  provinceDropdown.addEventListener('change', handleCityPopulation);
  cityDropdown.addEventListener('change', updateLocations);
  document.addEventListener('DOMContentLoaded', () => {
      handleCityPopulation();
      updateLocations();
  });
} else {
  console.error('Required elements missing');
}

// Area Category Auto-Select
const areaInput = document.getElementById('selectArea');
const areaCategoryDropdown = document.getElementById('areaCategoryDropdown');

function updateAreaCategory() {
  const areaMarla = parseInt(areaInput.value) || 0;
  let category = '';
  if (areaMarla <= 5) category = '0-5 Marla';
  else if (areaMarla <= 10) category = '5-10 Marla';
  else if (areaMarla <= 15) category = '10-15 Marla';
  else if (areaMarla <= 20) category = '15-20 Marla';
  else if (areaMarla > 20) category = '1-5 Kanal';

  Array.from(areaCategoryDropdown.options).forEach(option => {
    if (option.value === category) {
      option.selected = true;
      option.disabled = false;
    } else {
      option.disabled = areaMarla > 0;
    }
  });
  if (areaMarla === 0) {
    areaCategoryDropdown.value = '';
    Array.from(areaCategoryDropdown.options).forEach(option => {
      option.disabled = false;
    });
  }
}
if (areaInput && areaCategoryDropdown) {
  areaInput.addEventListener('input', updateAreaCategory);
  document.addEventListener('DOMContentLoaded', updateAreaCategory);
}
// Function to handle the "Get Insights" button click
function scrollToInsights() {
  document.getElementById("insightSection").scrollIntoView({ behavior: 'smooth' });
}
