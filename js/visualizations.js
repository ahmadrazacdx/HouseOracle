function resizeCanvasForDPI(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
 
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
 
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
 
    canvas.getContext('2d').scale(dpr, dpr);
 }
 
 const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
       const canvas = entry.target.querySelector('canvas');
       if (canvas) {
          resizeCanvasForDPI(canvas);
          if (revenueChartInstance) revenueChartInstance.resize();
          if (categoriesChartInstance) categoriesChartInstance.resize();
       }
    }
 });
 
 document.querySelectorAll('.chart-container').forEach(container => {
    resizeObserver.observe(container);
 });
 let revenueChartInstance = null;
 let categoriesChartInstance = null;
 let listingsTrendChartInstance = null;
 
 async function loadCityData(city) {
    const response = await fetch(`./artifacts/data/${city}.json`);
    return await response.json();
 }
 document.addEventListener('DOMContentLoaded', () => {
    updateDashboard('overall');
 });
 
 // City selector change handler
 document.getElementById('citySelector').addEventListener('change', (e) => {
    const selectedCity = e.target.value;
    if (selectedCity) {
       updateDashboard(selectedCity);
    }
 });
 
 function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 }
 
 function updateInfoCards(info) {
    const kpiContainer = document.getElementById('infoCards');
    kpiContainer.innerHTML = `
           <div class="col-md-3">
             <div class="info-card">
               <div class="info-value"> <i class="bi bi-cash-coin me-2"></i>Rs ${formatNumber(info.avg_price)}</div>
               <div class="info-label">Average Price</div>
             </div>
           </div>
           <div class="col-md-3">
             <div class="info-card">
               <div class="info-value"><i class="bi bi-buildings me-2"></i>${formatNumber(info.total_properties)}</div>
               <div class="info-label">Total Properties</div>
             </div>
           </div>
           <div class="col-md-3">
             <div class="info-card">
               <div class="info-value"><i class="fa fa-bed" aria-hidden="true"  style="margin-right: 0.5rem;"></i>${info.avg_beds}</div>
               <div class="info-label">Avg Bedrooms</div>
             </div>
           </div>
           <div class="col-md-3">
             <div class="info-card">
               <div class="info-value"><i class="fa fa-bath" aria-hidden="true"  style="margin-right: 0.5rem;"></i>${info.avg_baths}</div>
               <div class="info-label">Avg Bathrooms</div>
             </div>
           </div>
         `;
 }
 
 function createDonutChart(data) {
   if (revenueChartInstance) revenueChartInstance.destroy();

   let house = 0, flat = 0, others = 0;

   data.labels.forEach((label, i) => {
       const value = data.data[i];
       const key = label.toLowerCase();
       if (key === "house") house = value;
       else if (key === "flat") flat = value;
       else others += value;
   });

   const finalLabels = ["House", "Flat"];
   const finalData = [house, flat];
   if (others > 0) {
       finalLabels.push("Others");
       finalData.push(others);
   }

   const ctx = document.getElementById('revenueChart').getContext('2d');
   revenueChartInstance = new Chart(ctx, {
       type: 'doughnut',
       data: {
           labels: finalLabels,
           datasets: [{
               data: finalData,
               backgroundColor: ["#06ad46", "#ff9800", "#a5d6a7"],
               borderWidth: 2,
               borderRadius: 10,
           }]
       },
       options: {
           responsive: true,
           maintainAspectRatio: false,
           cutout: '60%',
           plugins: {
               legend: {
                   position: 'bottom',
                   labels: {
                       boxWidth: 20,
                       font: { size: 14 }
                   }
               },
               tooltip: {
                   callbacks: {
                       label: (ctx) => {
                           const val = ctx.raw || 0;
                           const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                           const pct = ((val / total) * 100).toFixed(1);
                           return `${ctx.label}: Rs ${formatNumber(val)} (${pct}%)`;
                       }
                   }
               }
           }
       }
   });
}
 
 function createCategoriesChart(data) {
    if (categoriesChartInstance) categoriesChartInstance.destroy();
    const baseColor = 'rgb(6, 173, 70,';
    const backgroundColors = [
       `${baseColor} 0.9)`,
       `${baseColor} 0.7)`,
       `${baseColor} 0.5)`,
       `${baseColor} 0.3)`,
       `${baseColor} 0.2)`
    ];
 
    const canvas = document.getElementById('categoriesChart');
    resizeCanvasForDPI(canvas);
    const ctx = canvas.getContext('2d');
    categoriesChartInstance = new Chart(ctx, {
       type: 'bar',
       data: {
          labels: data.labels,
          datasets: [{
             data: data.data,
             backgroundColor: backgroundColors,
             borderRadius: 18,
             borderSkipped: false
         
          },]
       },
       options: {
          responsive: true,
          maintainAspectRatio: false,
 
          plugins: {
             legend: {
                display: false
             },
             tooltip: {
                callbacks: {
                   label: (context) => `${context.raw} properties`
                }
             }
          },
          scales: {
             y: {
                beginAtZero: true
             }
          }
       },
 
    });
 }
 
 function createListingsTrendChart(data) {
    if (listingsTrendChartInstance) listingsTrendChartInstance.destroy();
 
    listingsTrendChartInstance = new ApexCharts(document.querySelector("#listingsTrendChart"), {
       series: [{
          name: "Listings",
          data: data.listings
       }, {
          name: "3-Month AVG",
          data: data.rolling_avg
       }],
       chart: {
          type: 'area',
          height: 330,
          toolbar: {
             show: false
          }
       },
       stroke: {
          curve: 'smooth',
          width: [3, 2]
       },
       dataLabels: {
          enabled: false
       },
       fill: {
          type: 'gradient',
          gradient: {
             shadeIntensity: 1,
             opacityFrom: 0.4,
             opacityTo: 0,
             stops: [0, 100],
             gradientToColors: ['#a5d6a7'],
             inverseColors: false
          }
       },
       colors: ['#06ad46', '#ff9800'], 
       xaxis: {
          categories: data.dates,
          labels: {
             rotate: -45
          }
       },
       yaxis: {
          labels: {
             formatter: (value) => formatNumber(value)
          }
       },
       tooltip: {
          y: {
             formatter: (value) => `${formatNumber(value)} listings`
          }
       },
       legend: {
          position: 'top'
       }
    });
 
    listingsTrendChartInstance.render();
 }
 
 
 async function updateDashboard(city = 'islamabad') {
    try {
       const data = await loadCityData(city);
 
       updateInfoCards(data.info);
       createDonutChart(data.revenue_distribution);
       createCategoriesChart(data.top_categories);
       createListingsTrendChart(data.listings_trend);
    } catch (error) {
       console.error('Error loading dashboard data:', error);
    }
 }

 document.addEventListener('DOMContentLoaded', () => updateDashboard());
 document.getElementById('citySelector').addEventListener('change', (e) => {
    updateDashboard(e.target.value);
 });