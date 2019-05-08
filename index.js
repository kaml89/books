const form = document.querySelector('form');
let title = '';
const searchResults = document.querySelector('.search-results');

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
  let loader = `<div class="spinner"></div>`;
  document.querySelector('footer').innerHTML = loader;

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
  if ('items' in results) {
    document.querySelector('footer').innerHTML = '';
    searchResults.innerHTML += results.items.map((item) => {
      if(item.volumeInfo.imageLinks) {
        console.log(item);
        return `<div class='book'>
                  <h3>${item.volumeInfo.title}</h3>
                  <div class='description'>${descriptionShortener(item.volumeInfo.description) || 'No description'}</div>
                  <img src='${item.volumeInfo.imageLinks.thumbnail}'>
                </div>`;
      }
      else {
        return `<div class='book'>
                  <h3>${item.volumeInfo.title}</h3>
                  <div class='description'>${descriptionShortener(item.volumeInfo.description) || 'No description'}</div>
                  <img src='coverplaceholder.jpg'>
                </div>`;
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
  title = document.querySelector('#search-bar').value;
  searchResults.innerHTML = '';
  fetchBooks(title, startIndex);
  startIndex += 10;
}

form.addEventListener('submit', handleSubmit);

function descriptionShortener(desc) {
  if (desc) {
    return desc.split(' ').slice(0, 19).join(' ').concat('...');
  }
}