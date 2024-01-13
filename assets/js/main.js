const apiUrl = 'http://localhost:8000/api/v1/titles/';
let currentPage = 1;
let preloadedData = [];

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function paginatedFetchData(filter, iteration = 2, createTuple = false) {
    try {
        const promises = [];
        
        const totalPages = iteration;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const pageUrl = `${apiUrl}?page=${currentPage}&${filter}`;
            promises.push(fetchData(pageUrl));
        }
    
        const results = await Promise.all(promises);
    
        const allMovies = results.flatMap(result => result.results);
        
        if (createTuple) {
            return await processResponse(allMovies)
        }
    
        return allMovies;
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function processResponse(apiResponse) {
    try {
        const firstEntry = apiResponse[0].id;
        const firstEntryUrl = `${apiUrl}${firstEntry}`;
        const restEntries = apiResponse.slice(1);

        await backgroundImgLoad(firstEntryUrl);

        return [firstEntry, restEntries];
    } catch (error) {
        console.error('Error processing response:', error);
    }
}

async function backgroundImgLoad(url) {
    try {
        const movie = await fetchData(url);

        if (movie && movie.image_url) {
            const backgroundImageDom = document.getElementById('backgroundImage');
            backgroundImageDom.src = movie.image_url;
        } else {
            console.error('Invalid movie data or missing image_url property');
        }
    } catch (error) {
        console.error('Error loading background image:', error);
    }
}

async function setTopMovie(movie){
    const topMovie = await fetchData(`${apiUrl}${movie}`);

    const topMovieBlock = document.getElementById("topMovieBlock");
    topMovieBlock.innerHTML = '';

    const topMovieDetailBlock = document.createElement('div');
    topMovieDetailBlock.classList.add('top-movie-details-block');

    const topMovieTitle = document.createElement('h1');
    topMovieTitle.innerText = `${topMovie.title}`;

    const descriptionBlock = document.createElement('div');
    descriptionBlock.classList.add('top-movie-description-block');

    const playBtn = document.createElement('button');
    playBtn.innerText = "Play "
    const playIcon = document.createElement('i');
    playIcon.classList.add('icon-play');

    playBtn.appendChild(playIcon);

    const description = document.createElement('p');
    description.classList.add('top-movie-description');
    description.innerText = `${topMovie.description}`;

    descriptionBlock.appendChild(topMovieTitle);
    descriptionBlock.appendChild(playBtn);
    descriptionBlock.appendChild(description);

    const imgBlock = document.createElement('div');
    imgBlock.classList.add('top-movie-img-block');

    const img = document.createElement('img');
    img.src = topMovie.image_url;
    img.alt = topMovie.title;
    img.classList.add('top-movie-img');   

    imgBlock.appendChild(img)
    img.onerror = ()=>{img.src = '../assets/img/JSI_logo_only_w.png'; img.classList.add('broken-img');}

    topMovieDetailBlock.appendChild(descriptionBlock);
    topMovieDetailBlock.appendChild(imgBlock);
    topMovieBlock.appendChild(topMovieDetailBlock);
}

window.addEventListener('load', function() {
    init();
});

async function init(){
    try {
        const initialMostRatedList = await paginatedFetchData('sort_by=-imdb_score', 3, true);
        const topMovie = await setTopMovie(initialMostRatedList[0]);
        const topRatedMoviesSection = new MovieRow('sort_by=-imdb_score', 'topRatedMoviesSection', 7, data = initialMostRatedList[1]);   
        const fantasySection = new MovieRow('genre=fantasy&sort_by=-imdb_score', 'fantasySection');   
        const adventureSection = new MovieRow('genre=adventure&sort_by=-imdb_score', 'adventureSection');   
        const animationSection = new MovieRow('genre=animation&sort_by=-imdb_score', 'animationSection');   

    } catch (error) {
        console.error('Error initializing:', error);
    }
}