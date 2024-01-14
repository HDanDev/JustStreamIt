class MovieRow {
    constructor(filter, targetElementId, sampleSize = 7, data = null) {
        this.filter = filter;
        this.targetElementId = targetElementId;
        this.sampleSize = sampleSize;
        this.data = data;
        this.currentIndex = 1;
        this.init();
    }

    async init(){
        let moviesDataSet;
        if (this.data === null) {
            moviesDataSet = await paginatedFetchData(this.filter);
            this.data = moviesDataSet;
        }
        else {
            moviesDataSet = this.data;
        }
        const moviesSample = moviesDataSet.slice(0, this.currentIndex * this.sampleSize); 
    
        const movieRow = document.getElementById(this.targetElementId);

        this.domCreateRow(moviesSample, movieRow);
    }

    domCreateRow(movies, targetElementId) {

        targetElementId.innerHTML = '';

        const leftArrow = document.createElement('div');
        (this.currentIndex === 1) ? leftArrow.classList.add('d-none') : leftArrow.classList.add('carousel-left-arrow');
        
        const leftArrowIcon = document.createElement('i');
        leftArrowIcon.classList.add('icon-chevron-thin-left')
        leftArrow.appendChild(leftArrowIcon);

        const rightArrow = document.createElement('div');
        (this.currentIndex * this.sampleSize >= this.data.length) ? rightArrow.classList.add('d-none') : rightArrow.classList.add('carousel-right-arrow');
        
        const rightArrowIcon = document.createElement('i');
        rightArrowIcon.classList.add('icon-chevron-thin-right')
        rightArrow.appendChild(rightArrowIcon);

        leftArrow.addEventListener('click', async () => this.moveCarousel(false, targetElementId));
        rightArrow.addEventListener('click', async () => this.moveCarousel(true, targetElementId));

        targetElementId.appendChild(leftArrow);
        targetElementId.appendChild(rightArrow);

        movies.forEach((movie, index) => {
            
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('thumbnail-container');
            movieContainer.dataset.index = index;
            if (index === 0) {
                movieContainer.id = 'first-item';
                this.hoverListener(movieContainer, leftArrow, 'adjusted-right');
            }
        
            if (index === movies.length - 1) {
                movieContainer.id = 'last-item';
                this.hoverListener(movieContainer, rightArrow, 'adjusted-left');  
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

    async moveCarousel(isClickingRight, targetElement) {
        let moviesSample = [];

        if (isClickingRight) {
        const newSample = this.currentIndex * this.sampleSize;
        console.log(`slice(${newSample}, ${newSample + this.sampleSize})`);
            moviesSample = this.data.slice(newSample, newSample + this.sampleSize); 
            try {
                const resultArray = await paginatedFetchData(this.filter, this.currentIndex);
                
                this.data = [...this.data, ...resultArray];
                console.log(this.data);
                this.currentIndex += 1;
            } 
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        else {
            const newSample = (this.currentIndex - 2) * this.sampleSize;
            console.log(`slice(${newSample - this.sampleSize * 2}, ${newSample})`);
            moviesSample = this.data.slice(newSample, newSample + this.sampleSize); 
            this.currentIndex -= 1;
        }
        this.domCreateRow(moviesSample, targetElement)
    }

    hoverListener(hoveredElement, targetElement, newClass){

        hoveredElement.addEventListener('mouseover', () => {
            targetElement.classList.add(newClass);    
        });
    
        hoveredElement.addEventListener('mouseout', () => {
            targetElement.classList.remove(newClass);
        });
    }

    async displayMovieDetails(movie) {
        const movieModal = new MovieModal(movie);   
    }
}