let slideIndex = 0;
      showSlides(slideIndex);

      function showSlides(index) {
        const slides = document.getElementsByClassName("mySlides");
        if (index >= slides.length) { slideIndex = 0 }
        if (index < 0) { slideIndex = slides.length - 1 }

        for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }

        slides[slideIndex].style.display = "block";
      }

      document.addEventListener('DOMContentLoaded', function() {
        // Seleziona tutte le immagini con la classe "mySlides"
        var slides = document.querySelectorAll('.mySlides');

        // Per ogni immagine, aggiungi un gestore di eventi per il passaggio del mouse
        slides.forEach(function(slide) {
            const hoverContainer = slide.querySelector('.hover-container');
            const rectangle = hoverContainer.querySelector('.hover-rectangle');
            const text = hoverContainer.querySelector('.text');

            slide.addEventListener('mouseover', function() {
                // Mostra il rettangolo e il testo
                rectangle.style.display = 'block';
                text.style.display = 'block';
            });

            slide.addEventListener('mouseout', function() {
                // Nascondi il rettangolo e il testo quando il mouse esce dall'immagine
                rectangle.style.display = 'none';
                text.style.display = 'none';
            });
        });
      });

      document.addEventListener('DOMContentLoaded', function () {
        const cursor = document.createElement('img');
        cursor.src = 'path/to/your/image.png'; // Percorso dell'immagine del cursore
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', function (e) {
            const x = e.clientX;
            const y = e.clientY;

            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';

            // Cambia l'immagine del cursore in base alla posizione
            if (x > window.innerWidth / 2) {
                cursor.src = '/assets/cursore.png';
            } else {
                cursor.src = '/assets/cursore3.png';
            }
        });
      });

      document.addEventListener("click", function (event) {
        const screenWidth = window.innerWidth;
        const clickX = event.clientX;

        if (clickX > screenWidth / 2) {
          showSlides(slideIndex += 1); // Clic nella parte destra, vai alla slide successiva
        } else {
          showSlides(slideIndex -= 1); // Clic nella parte sinistra, torna alla slide precedente
        }
      });