const columnDefs = [
  { field: "Property Type", headerName: "Property Type", sortable: true, filter: true },
  { field: "Province", headerName: "Province", sortable: true, filter: true },
  { field: "City", headerName: "City", sortable: true, filter: true },
  { field: "Location", headerName: "Location", sortable: true, filter: true },
  { field: "Bathrooms", headerName: "Baths", sortable: true, filter: true },
  { field: "Bedrooms", headerName: "Beds", sortable: true, filter: true },
  { field: "Purpose", headerName: "Purpose", sortable: true, filter: true },
  { field: "Area(Marla)", headerName: "Area(Marla)", sortable: true, filter: true },
  { field: "Area Category", headerName: "Area Category", sortable: true, filter: true },
  { field: "Price", headerName: "Price(Pkr)", sortable: true, filter: true }
];

document.addEventListener('DOMContentLoaded', () => {
    const Properties = "./artifacts/data/featured_properties.json"
    fetch(Properties)
        .then((res) => res.json())
        .then((data) => {
            const gridOptions = {
                columnDefs: columnDefs,
                rowData: data,
                theme: 'legacy', // Force legacy theme mode
                pagination: true,
                paginationPageSize: 10,
                paginationPageSizeSelector: [10, 20, 50],
                suppressPaginationPanel: false,
                rowHeight: 48,
                animateRows: true,
                getRowStyle: params => ({
                    backgroundColor: params.node.rowIndex % 2 === 0 ? '#ffffff' : '#8fff94'
                }),
                onGridReady: (params) => {
                    params.api.sizeColumnsToFit();
                    window.gridApi = params.api;
                },
                onFirstDataRendered: (params) => {
                    params.api.sizeColumnsToFit();
                }
            };

            const gridDiv = document.querySelector("#myGrid");
            agGrid.createGrid(gridDiv, gridOptions);
        })
        .catch((err) => {
            console.error("Error loading table:", err);
    });
});