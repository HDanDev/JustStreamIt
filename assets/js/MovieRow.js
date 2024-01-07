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
    
        const movieRow = document.getElementById(this.targetElementId);

        this.domCreateRow(moviesSample, movieRow)
    }

    domCreateRow(movies, targetElementId) {

        const leftArrow = document.createElement('div');
        leftArrow.classList.add('carousel-left-arrow');
        
        const leftArrowIcon = document.createElement('i');
        leftArrowIcon.classList.add('icon-chevron-thin-left')
        leftArrow.appendChild(leftArrowIcon);

        const rightArrow = document.createElement('div');
        rightArrow.classList.add('carousel-right-arrow');
        
        const rightArrowIcon = document.createElement('i');
        rightArrowIcon.classList.add('icon-chevron-thin-right')
        rightArrow.appendChild(rightArrowIcon);

    
        targetElementId.appendChild(leftArrow);
        targetElementId.appendChild(rightArrow);

        movies.forEach((movie, index) => {
            
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('thumbnail-container');
            if (index === 0) {
                movieContainer.id = 'first-item';
                hoverListener(movieContainer, leftArrow, 'adjusted-right');
            }
        
            if (index === movies.length - 1) {
                movieContainer.id = 'last-item';
                hoverListener(movieContainer, rightArrow, 'adjusted-left');  
            }

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