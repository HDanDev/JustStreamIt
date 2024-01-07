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

function hoverListener(hoveredElement, targetElement, newClass){

    hoveredElement.addEventListener('mouseover', () => {
        targetElement.classList.add(newClass);    
    });
  
    hoveredElement.addEventListener('mouseout', () => {
        targetElement.classList.remove(newClass);
    });
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