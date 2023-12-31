async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function displayMovieDetails(movie) {
    movieDetailUrl = 'http://localhost:8000/api/v1/titles/' + movie.id;
    movieData = await fetchData(movieDetailUrl);

    const modal = document.getElementById('movieModal');
    modal.innerHTML = '';

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            closeModal(); 
        }
    });

    const movieTitleBlock = document.createElement('h1');
    movieTitleBlock.innerText = `${movie.title}`;

    const detailsBlock = document.createElement('div');
    detailsBlock.classList.add('modal-details-block');

    const descriptionBlock = document.createElement('div');
    detailsBlock.classList.add('modal-description-block');

    const imgBlock = document.createElement('div');
    detailsBlock.classList.add('modal-img-block');

    const img = document.createElement('img');
    img.src = movie.image_url;
    img.alt = movie.title;
    img.classList.add('modal-img');   

    imgBlock.appendChild(img)
    
    detailsBlock.appendChild(descriptionBlock)
    detailsBlock.appendChild(imgBlock)

    // img.addEventListener('click', () => displayImgLightBox(img));

    modalContainer.appendChild(movieTitleBlock);
    modalContainer.appendChild(detailsBlock);

    modal.appendChild(modalContainer);
    openModal()
}

async function fetchAndDisplayBestMovies() {
    const apiUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';
    const bestMoviesData = await fetchData(apiUrl);

    const bestMovies = bestMoviesData.results.slice(0, 10); 

    const bestMovieSection = document.getElementById('bestMovieSection');
    bestMovies.forEach((movie) => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('thumbnail-container');

        const movieTitle = document.createElement('h2');
        movieTitle.innerText = `${movie.title}`;

        const movieImage = document.createElement('img');
        movieImage.src = movie.image_url;
        movieImage.alt = movie.title;
        movieImage.classList.add('thumbnail-img');

        const watermark = document.createElement('img');
        watermark.src = '../assets/img/JSI_logo_only_w.png';
        watermark.alt = 'Just Stream It logo';
        watermark.classList.add('watermark');

        movieContainer.addEventListener('click', () => displayMovieDetails(movie));

        movieContainer.appendChild(movieTitle);
        movieContainer.appendChild(movieImage);
        movieContainer.appendChild(watermark);

        bestMovieSection.appendChild(movieContainer);
    });
}

fetchAndDisplayBestMovies();

document.getElementById('closeModalBtn').addEventListener('click', closeModal);

function openModal() {
    document.getElementById('movieModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
}
