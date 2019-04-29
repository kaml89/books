const form = document.querySelector('form');
let title = '';
const searchResults = document.querySelector('.searchResults');

function throttle (callback, limit) {
  var wait = false;                  // Initially, we're not waiting
  return function () {               // We return a throttled function
      if (!wait) {                   // If we're not waiting
          callback.call();           // Execute users function
          wait = true;               // Prevent future invocations
          setTimeout(function () {   // After a period of time
              wait = false;          // And allow future invocations
          }, limit);
      }
  }
}

let startIndex = 0;
window.addEventListener('scroll', throttle(checkScroll, 500));

function checkScroll() {
  if(window.innerHeight + window.scrollY + 100 >= document.body.offsetHeight) {
    fetchBooks(title, startIndex);
    startIndex += 10;
    console.log(startIndex);
  }
}

function fetchBooks(title, startIndex) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${title}&startIndex=${startIndex}`;
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      renderResults(myJson);
    })
    .catch((e) => console.log(e));
}


function renderResults(results) {
  // results.forEach((item) => {
  //   searchResults.appendChild(`<div><img src='${item.volumeInfo.imageLinks.thumbnail}'></div>`);
  // });
  if ('items' in results) {
    searchResults.innerHTML += results.items.map((item) => {
      if(item.volumeInfo.imageLinks) {
        return `<div><img src='${item.volumeInfo.imageLinks.thumbnail}'></div>`;
      }
      else {
        return `<div>Placeholder</div>`;
      }
      
    }).join('');
  }
  else {
    const elem = document.createElement('div');
    elem.innerHTML = '.';
    searchResults.appendChild(elem);
  }
}

function handleClick() {
  fetchBooks(startIndex);
  startIndex += 10;
}

function handleSubmit(e) {
  e.preventDefault();
  title = document.querySelector('.searchField').value;
  searchResults.innerHTML = '';
  fetchBooks(title, startIndex);
  startIndex += 10;
}

// button.addEventListener('click', handleClick);
form.addEventListener('submit', handleSubmit);