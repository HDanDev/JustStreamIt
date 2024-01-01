const apiUrl = 'http://localhost:8000/api/v1/titles/';

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function paginatedFetchData(filter, iteration = 2) {
    try {
        const promises = [];
        
        const totalPages = iteration;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const pageUrl = `${apiUrl}?page=${currentPage}&${filter}`;
            promises.push(fetchData(pageUrl));
        }
    
        const results = await Promise.all(promises);
    
        const allMovies = results.flatMap(result => result.results);
    
        return allMovies;
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

class MovieModal {
    constructor(movie, targetElementId = 'modalContainer') {
        this.movie = movie;
        this.targetElementId = targetElementId;
        this.init();
    }

    async init(){
        const movieData = await fetchData(`${apiUrl}${this.movie.id}`);
    
        const modal = document.getElementById(this.targetElementId);
        modal.innerHTML = '';
    
        const movieTitleBlock = document.createElement('h1');
        movieTitleBlock.innerText = `${movieData.title}`;
    
        const detailsBlock = document.createElement('div');
        detailsBlock.classList.add('modal-details-block');
    
        const descriptionBlock = document.createElement('div');
        detailsBlock.classList.add('modal-description-block');

        const imdbRating = document.createElement('p');
        imdbRating.innerText = movieData.imdb_score;

        descriptionBlock.appendChild(imdbRating)
    
        const imgBlock = document.createElement('div');
        detailsBlock.classList.add('modal-img-block');
    
        const img = document.createElement('img');
        img.src = movieData.image_url;
        img.alt = movieData.title;
        img.classList.add('modal-img');   
    
        imgBlock.appendChild(img)
        img.onerror = ()=>{img.src = '../assets/img/JSI_logo_only_w.png'; img.classList.add('broken-img');}
        
        detailsBlock.appendChild(descriptionBlock)
        detailsBlock.appendChild(imgBlock)
    
        // img.addEventListener('click', () => displayImgLightBox(img));
    
        modal.appendChild(movieTitleBlock);
        modal.appendChild(detailsBlock);
    
        this.openModal(modal)
    }

    openModal(targetElement) {
        document.getElementById('movieModal').style.display = 'flex';
        
        document.getElementById('closeModalBtn').addEventListener('click', this.closeModal);
        
        targetElement.addEventListener('click', (event) => {
            if (event.target === targetElement) {
                this.closeModal(); 
            }
        });
    }

    closeModal() {
    document.getElementById('movieModal').style.display = 'none';
    }
}

class MovieRow {
    constructor(filter, targetElementId, sampleSize = 7) {
        this.filter = filter;
        this.targetElementId = targetElementId;
        this.sampleSize = sampleSize;
        this.init();
    }

    async init(){
        const moviesDataSet = await paginatedFetchData(this.filter);
        const moviesSample = moviesDataSet.slice(0, this.sampleSize); 
    
        const bestMovieSection = document.getElementById(this.targetElementId);

        this.domCreateRow(moviesSample, bestMovieSection)
    }

    domCreateRow(movies, targetElementId) {

        movies.forEach((movie) => {
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
    
            movieContainer.addEventListener('click', () => this.displayMovieDetails(movie));
    
            movieContainer.appendChild(movieTitle);
            movieContainer.appendChild(movieImage);
            movieImage.onerror = ()=>{movieImage.src = '../assets/img/JSI_logo_only_w.png'; movieImage.classList.add('broken-img');}
            movieContainer.appendChild(watermark);
    
            targetElementId.appendChild(movieContainer);
        });
    }

    async displayMovieDetails(movie) {
        const movieModal = new MovieModal(movie);   
    }
}

window.addEventListener('load', function() {
    init();
});

function init(){
    const topRatedMoviesSection = new MovieRow('sort_by=-imdb_score', 'topRatedMoviesSection');   
    const fantasySection = new MovieRow('genre=fantasy&sort_by=-imdb_score', 'fantasySection');   
    const adventureSection = new MovieRow('genre=adventure&sort_by=-imdb_score', 'adventureSection');   
    const animationSection = new MovieRow('genre=animation&sort_by=-imdb_score', 'animationSection');   

}