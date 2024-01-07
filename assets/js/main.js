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

        await BackgroundImgLoad(firstEntryUrl);

        return [firstEntry, restEntries];
    } catch (error) {
        console.error('Error processing response:', error);
    }
}

async function BackgroundImgLoad(url) {
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

window.addEventListener('load', function() {
    init();
});

async function init(){
    try {
        const initialMostRatedList = await paginatedFetchData('sort_by=-imdb_score', 3, true);
        const topRatedMoviesSection = new MovieRow('sort_by=-imdb_score', 'topRatedMoviesSection', 7, data = initialMostRatedList[1]);   
        const fantasySection = new MovieRow('genre=fantasy&sort_by=-imdb_score', 'fantasySection');   
        const adventureSection = new MovieRow('genre=adventure&sort_by=-imdb_score', 'adventureSection');   
        const animationSection = new MovieRow('genre=animation&sort_by=-imdb_score', 'animationSection');   

    } catch (error) {
        console.error('Error initializing:', error);
    }
}