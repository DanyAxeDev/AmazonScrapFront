document.getElementById("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = document.getElementById("query").value;
  const page = document.getElementById("page").value || 1;

  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "<p>Carregando...</p>";

  try {
    const response = await fetch(
      `http://localhost:3000/api/scrape?busca=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const products = await response.json();

    productsContainer.innerHTML = "";

    if (products.length === 0) {
      productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");

      const rating = product.rating ? product.rating : "Sem informações";
      const amountReviews = product.amountReviews ? product.amountReviews : "Sem informações";
      let priceOscilation = "";
      let priceChangeValue;
      if (!product.priceChange) {
        priceOscilation = priceChangeValue = "Sem informações";
      } else {
        if (product.priceChange.direction === "up") {
          priceOscilation = "Aumentou";
          priceChangeValue = product.priceChange.change;
        } else if (product.priceChange.direction === "down") {
          priceOscilation = "Abaixou"
          priceChangeValue = product.priceChange.change;
        } else if (product.priceChange.direction === "same") {
          priceOscilation = "Se manteve"
          priceChangeValue = 0;
        }
      }

      productElement.innerHTML = `
        <img src="${product.productImageURL}" alt="${product.productName}" />
        <div>
          <h3>${product.productName}</h3>
          <p>${product.currentPrice}</p>
          <p>Quantidade de avaliações: ${amountReviews}</p>
          <p>Rating: ${rating}</p>
          <p>Oscilação no preço: ${priceOscilation}</p>
          <p>Valor da oscilação: ${priceChangeValue}</p>
          <p>Loja: ${product.loja}</p>
        </div>
      `;

      productsContainer.appendChild(productElement);
    });
  } catch (error) {
    console.error(error);
    productsContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
});
