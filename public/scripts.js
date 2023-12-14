fetch('/products')
  .then(response => response.json())
  .then(products => {
    const productListDiv = document.getElementById('productList');
    productListDiv.innerHTML = '<h3>Lista de Productos</h3>';
    products.forEach(product => {
      productListDiv.innerHTML += `<p>${product.name} - $${product.price.toFixed(2)}</p>`;
    });
  })
  .catch(error => console.error('Error cargando productos:', error));
