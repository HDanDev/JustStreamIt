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

        const modalCloseIcon = document.createElement('i');
        modalCloseIcon.id = 'closeModalBtn';
        modalCloseIcon.classList.add('icon-cross');
    
        const movieTitleBlock = document.createElement('h1');
        movieTitleBlock.innerText = `${movieData.title}`;
    
        const detailsBlock = document.createElement('div');
        detailsBlock.classList.add('modal-details-block');

        const descriptionBlock = document.createElement('div');
        descriptionBlock.classList.add('modal-description-block');
    
        const imdbRatingBlock = document.createElement('div');
        imdbRatingBlock.classList.add('modal-imdb-rating-block');

        const imdbRating = document.createElement('p');
        imdbRating.innerText = movieData.imdb_score;

        const imdbRatingStarIcon = document.createElement('i');
        imdbRatingStarIcon.classList.add('icon-star');

        imdbRatingBlock.appendChild(imdbRating);
        imdbRatingBlock.appendChild(imdbRatingStarIcon);

        const rating = document.createElement('p');
        rating.innerText = movieData.rated;
        switch (movieData.rated) {
            case 'G':
                rating.classList.add('green');                
                break;
            case 'PG-13':
                rating.classList.add('purple');                
                break;
            case 'R':
                rating.classList.add('red');                
                break;
            case 'NC-17':
                rating.classList.add('blue');                
                break;
            default:
                rating.classList.add('orange');                
                break;
        }

        const movieGenre = document.createElement('p');
        const genresString = movieData.genres.join(', ');
        movieGenre.innerText = genresString;

        const releaseDate = document.createElement('p');
        releaseDate.innerText = movieData.date_published;

        const directors = document.createElement('p');
        const directorsString = movieData.directors.join(', ');
        directors.innerText = directorsString;

        const actors = document.createElement('p');
        const actorsString = movieData.actors.join(', ');
        actors.innerText = actorsString;

        const country = document.createElement('p');
        const countriesString = movieData.countries.join(', ');
        country.innerText = countriesString;

        const duration = movieData.duration;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const durationString = `${hours}h${formattedMinutes}`;

        const movieDuration = document.createElement('p');
        movieDuration.innerText = durationString;
        
        const boxOffice = document.createElement('p');
        const formattedAmount = movieData.worldwide_gross_income != null ? `${movieData.worldwide_gross_income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}$` : 'Not disclosed';
        boxOffice.innerText = formattedAmount;

        const description = document.createElement('p');
        description.innerText = movieData.description;

        descriptionBlock.appendChild(imdbRatingBlock);
        if (movieData.rated != 'Not rated or unkown rating') descriptionBlock.appendChild(rating);
        descriptionBlock.appendChild(movieGenre);
        descriptionBlock.appendChild(releaseDate);
        descriptionBlock.appendChild(directors);
        descriptionBlock.appendChild(actors);
        descriptionBlock.appendChild(country);
        descriptionBlock.appendChild(movieDuration);
        descriptionBlock.appendChild(boxOffice);
        descriptionBlock.appendChild(description);
    
        const imgBlock = document.createElement('div');
        imgBlock.classList.add('modal-img-block');
    
        const img = document.createElement('img');
        img.src = movieData.image_url;
        img.alt = movieData.title;
        img.classList.add('modal-img');   
    
        imgBlock.appendChild(img);
        img.onerror = ()=>{img.src = '../assets/img/JSI_logo_only_w.png'; img.classList.add('broken-img');}
        
        detailsBlock.appendChild(descriptionBlock);
        detailsBlock.appendChild(imgBlock);
    
        // img.addEventListener('click', () => displayImgLightBox(img));
    
        modal.appendChild(modalCloseIcon);
        modal.appendChild(movieTitleBlock);
        modal.appendChild(detailsBlock);
    
        this.openModal();
    }

    openModal() {
        const modal = document.getElementById('movieModal');
        modal.style.display = 'flex';
        
        document.getElementById('closeModalBtn').addEventListener('click', this.closeModal);
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeModal(); 
            }
        });
    }

    closeModal() {
    document.getElementById('movieModal').style.display = 'none';
    }
}