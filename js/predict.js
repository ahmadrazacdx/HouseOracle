function getFormValues() {
    const inputs = {
       'purpose': document.getElementById('purposeDropdown').value,
       'property_type': document.getElementById("propertyTypeDropdown").value,
       'location': document.getElementById('locationDropdown').value,
       'city': document.getElementById('cityDropDown').value,
       'province_name': document.getElementById("provinceDropdown").value,
       'baths': Number(document.getElementById('selectBaths').value),
       'bedrooms': Number(document.getElementById('selectBeds').value),
       'area': Number(document.getElementById('selectArea').value),
       'Area Category': document.getElementById('areaCategoryDropdown').value,
    };
 
    return inputs;
}
 
 
async function showPrediction(event) {
    event.preventDefault();
    const form = document.querySelector('.form-container');
 
    if (!form.checkValidity()) {
       form.reportValidity();
       return;
    }
 
    try {
       const predictBtn = document.querySelector('.predict-btn');
       predictBtn.disabled = true;
       predictBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Predicting...';
 
       const formData = getFormValues();
       const URL = 'https://houseoracle-api.up.railway.app/predict';
       const response = await fetch(URL, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
       });
 
       if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const result = await response.json();
       updatePredictionDisplay(formData, result);
       displayRecommendations(result.recommendations);
       clearFormFields();
       document.getElementById('predictionResult').scrollIntoView({
          behavior: 'smooth'
       });
 
    } catch (error) {
       console.error('Prediction error:', error);
       showErrorToast('Prediction failed. Please try again.');
    } finally {
       const predictBtn = document.querySelector('.predict-btn');
       predictBtn.disabled = false;
       predictBtn.textContent = 'Get Prediction';
    }
}
 
function clearFormFields() {
    document.querySelectorAll('.form-select').forEach(select => {
       select.selectedIndex = 0;
    });
    document.querySelectorAll('.form-control[type="number"]').forEach(input => {
       input.value = input.min || '1';
    });
 
    const form = document.querySelector('.form-container');
    form.classList.remove('was-validated');
}
 
function updatePredictionDisplay(formData, result) {
    document.getElementById('displayPropertyType').textContent = formData.property_type;
    document.getElementById('displayProvince').textContent = formData.province_name;
    document.getElementById('displayCity').textContent = formData.city;
    document.getElementById('displayLocation').textContent = formData.location;
    document.getElementById('displayBaths').textContent = formData.baths;
    document.getElementById('displayBedrooms').textContent = formData.bedrooms;
    document.getElementById('displayArea').textContent = formData.area;
    document.getElementById('displayAreaCategory').textContent = formData['Area Category'];
    document.getElementById('displayPurpose').textContent = formData.purpose;
    const priceFormatter = new Intl.NumberFormat('en-PK', {
       style: 'currency',
       currency: 'PKR',
       maximumFractionDigits: 0
    });
    document.getElementById('predictedPrice').value = priceFormatter.format(result.predicted_price);
    document.getElementById('predictionResult').style.display = 'block';
}
 
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = '';
    const propertyImages = [
       './assets/images/house_01.webp',
       './assets/images/house_02.avif',
       './assets/images/house_03.avif',
    ];
    const formatLocation = (location, city) => {
       const cleanLocation = location.trim().toLowerCase();
       const cleanCity = (city || '').trim();
       const displayLocation = cleanLocation === 'others' ? 'N/A' : location;
       const displayCity = cleanCity || 'N/A';
       return `${displayCity}, ${displayLocation}`;
    };
 
    recommendations.forEach((property, index) => {
       const imgIndex = index % propertyImages.length;
       const imgSrc = propertyImages[imgIndex];
       const card = document.createElement('div');
       card.className = 'col-md-4 mb-4';
       card.innerHTML = `
             <div class="card h-100 shadow-sm animate__animated animate__fadeIn">
                 <div class="card-img-top placeholder-image">
                 <img src="${imgSrc}" class="card-img-top" alt="${property.location}">
                 </div>
                 <div class="card-body" style="padding: 1rem;">
                     <h5 class="card-title text-truncate">${formatLocation(property.location, property.city)}</h5>
                     <div class="property-details">
                         <div class="detail-item">
                             <i class="bi bi-cash-coin"></i>
                             <span>${formatPrice(property.price)}</span>
                         </div>
                         <div class="detail-item">
                             <i class="bi bi-door-open"></i>
                             <span>${property.bedrooms} Beds</span>
                         </div>
                         <div class="detail-item">
                             <i class="bi bi-bucket"></i>
                             <span>${property.baths} Baths</span>
                         </div>
                         <div class="detail-item">
                             <i class="bi bi-pin-map"></i>
                             <span>${property.area} Marla</span>
                         </div>
                     </div>
                     <div class="text-center mt-3">
                         <button class="btn btn-sm view-details-btn" onclick="window.open('https://www.zameen.com/', '_blank')">
                         View Details <i class="bi bi-arrow-right"></i>
                         </button>
                     </div>
 
                 </div>
             </div>
         `;
       container.appendChild(card);
    });
 
    document.getElementById('recommendationsSection').style.display = 'block';
}
 
setTimeout(() => {
    const containers = document.querySelectorAll('.property-image-container');
    containers.forEach(container => {
       container.style.width = '413px';
       container.style.height = '195px';
       const img = container.querySelector('img');
       img.style.width = '100%';
       img.style.height = '100%';
    });
}, 50);
 
function formatPrice(price) {
    return new Intl.NumberFormat('en-PK', {
       style: 'currency',
       currency: 'PKR',
       maximumFractionDigits: 0
    }).format(price);
}
 
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
    toast.role = 'alert';
    toast.innerHTML = `
         ${message}
         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
     `;
    document.body.appendChild(toast);
 
    setTimeout(() => toast.remove(), 5000);
}