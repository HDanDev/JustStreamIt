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