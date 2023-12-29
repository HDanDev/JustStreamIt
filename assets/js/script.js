async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMovieDetails(movie) {
}

async function fetchAndDisplayBestMovies() {
    const apiUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&imdb_score_min=1';
    const bestMoviesData = await fetchData(apiUrl);

    const bestMovies = bestMoviesData.results.slice(0, 10); 

    const bestMovieSection = document.getElementById('bestMovieSection');
    bestMovies.forEach((movie, index) => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieTitle = document.createElement('h2');
        movieTitle.innerText = `${index + 1}. ${movie.title}`;

        const movieImage = document.createElement('img');
        movieImage.src = movie.image_url;
        movieImage.alt = movie.title;

        const movieSummary = document.createElement('p');
        movieSummary.innerText = movie.description;

        movieContainer.addEventListener('click', () => displayMovieDetails(movie));

        movieContainer.appendChild(movieTitle);
        movieContainer.appendChild(movieImage);
        movieContainer.appendChild(movieSummary);

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
