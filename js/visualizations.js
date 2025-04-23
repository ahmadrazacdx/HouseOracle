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
 
 function updateKPICards(kpis) {
    const kpiContainer = document.getElementById('kpiCards');
    kpiContainer.innerHTML = `
           <div class="col-md-3">
             <div class="kpi-card">
               <div class="kpi-value"> <i class="bi bi-cash-coin me-2"></i>Rs ${formatNumber(kpis.avg_price)}</div>
               <div class="kpi-label">Average Price</div>
             </div>
           </div>
           <div class="col-md-3">
             <div class="kpi-card">
               <div class="kpi-value"><i class="bi bi-buildings"></i>${formatNumber(kpis.total_properties)}</div>
               <div class="kpi-label">Total Properties</div>
             </div>
           </div>
           <div class="col-md-3">
             <div class="kpi-card">
               <div class="kpi-value"><i class="fa fa-bed" aria-hidden="true"  style="margin-right: 0.5rem;"></i>${kpis.avg_beds}</div>
               <div class="kpi-label">Avg Bedrooms</div>
             </div>
           </div>
           <div class="col-md-3">
             <div class="kpi-card">
               <div class="kpi-value"><i class="fa fa-bath" aria-hidden="true"  style="margin-right: 0.5rem;"></i>${kpis.avg_baths}</div>
               <div class="kpi-label">Avg Bathrooms</div>
             </div>
           </div>
         `;
 }
 
 function createRevenueChart(data) {
    if (revenueChartInstance) revenueChartInstance.destroy();
 
 
    const ctx = document.getElementById('revenueChart').getContext('2d');
    revenueChartInstance = new Chart(ctx, {
       type: 'pie',
       data: {
          labels: data.labels,
          datasets: [{
             data: data.data,
             backgroundColor: ['#2e7d32', '#60ad5e', '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e9'],
             borderWidth: 0
          }]
       },
       options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
             legend: {
                position: 'bottom'
             },
             tooltip: {
                callbacks: {
                   label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}: Rs ${formatNumber(value)}`;
                   }
                }
             }
          }
       }
    });
 }
 
 function resizeCanvasForDPI(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
 }
 
 function createCategoriesChart(data) {
    if (categoriesChartInstance) categoriesChartInstance.destroy();
    const baseColor = 'rgb(46, 125, 50,';
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
             borderRadius: 8
          }]
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
       colors: ['#2e7d32', '#ff9800'], 
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
 
       updateKPICards(data.kpis);
       createRevenueChart(data.revenue_distribution);
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