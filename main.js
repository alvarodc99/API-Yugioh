const cardContainer = document.getElementById('cardContainer');
const paginationContainer = document.getElementById('pagination');
const itemsPerPage = 9;
const cardsPerRow = 3;
let currentPage = 1;
let data = [];

// Fetch data from API
function fetchCardData() {
  fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(apiData => {
      data = apiData.data;
      displayCurrentPage();
      renderPagination();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Show cards for the current page
function displayCurrentPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  cardContainer.innerHTML = '';

  for (let i = 0; i < currentData.length; i += cardsPerRow) {
    const cardRow = document.createElement('div');
    cardRow.classList.add('row', 'mb-3');

    for (let j = 0; j < cardsPerRow; j++) {
      const cardIndex = i + j;
      if (cardIndex < currentData.length) {
        const cardData = currentData[cardIndex];
        const image = cardData.card_images[0].image_url;
        const title = cardData.name;
        const description = cardData.desc;
        const price = cardData.card_prices[0].cardmarket_price;

        const card = createCardElement(image, title, description, price);
        const cardColumn = document.createElement('div');
        cardColumn.classList.add('col-lg-4', 'col-md-6');
        cardColumn.appendChild(card);
        cardRow.appendChild(cardColumn);
      }
    }

    cardContainer.appendChild(cardRow);
  }
}

// Card Structure
function createCardElement(image, title, description, price) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${image}" class="card-img-top" style="height: 500px" alt="${title}">
    <div class="card-body bg-dark text-white rounded">
      <h5 class="card-title">${title}</h5>
      <div class="card-text">${description}</div>
      <p class="card-text">Card Market Price: US$${price}</p>
    </div>
  `;
  return card;
}

// Page number control
function renderPagination() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  paginationContainer.innerHTML = '';

  // Calculate the range of pages to display
  const startPage = Math.max(1, currentPage - 3);
  const endPage = Math.min(totalPages, currentPage + 3);

  // Add a button for the first page
  if (currentPage > 4) {
    const firstPageButton = document.createElement('button');
    firstPageButton.textContent = '1';
    firstPageButton.classList.add('btn', 'btn-dark');
    firstPageButton.addEventListener('click', () => {
      currentPage = 1;
      displayCurrentPage();
      renderPagination();
    });
    paginationContainer.appendChild(firstPageButton);

    // Add "..." to indicate more pages
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    paginationContainer.appendChild(ellipsis);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('btn', 'btn-dark');
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayCurrentPage();
      renderPagination();
    });

    // Add diferent color to selected page
    if (i === currentPage) {
      pageButton.classList.add('active-page');
    }

    paginationContainer.appendChild(pageButton);
  }

  // Add a button for the last page
  if (totalPages - currentPage > 3) {
    const lastPageButton = document.createElement('button');
    lastPageButton.textContent = totalPages;
    lastPageButton.classList.add('btn', 'btn-dark');
    lastPageButton.addEventListener('click', () => {
      currentPage = totalPages;
      displayCurrentPage();
      renderPagination();
    });
    paginationContainer.appendChild(lastPageButton);
  }
}

function initializeCardViewer() {
  fetchCardData();
}

initializeCardViewer();
