import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    TranslateModule
  ],
  standalone: true
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  // Iniettiamo ElementRef per cercare elementi solo dentro questo componente
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Configuriamo l'Observer
    const options = {
      root: null,
      rootMargin: '50px', // Inizia a caricare poco prima che appaia sullo schermo
      threshold: 0.15     // L'animazione scatta quando il 15% della sezione è visibile
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Quando la sezione è visibile, aggiungiamo la classe che fa partire il CSS
          entry.target.classList.add('is-visible');

          // Smettiamo di osservare per risparmiare batteria e memoria sul telefono
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Cerchiamo la sezione principale con la classe .scroll-reveal
    const section = this.el.nativeElement.querySelector('.scroll-reveal');
    if (section) {
      this.observer.observe(section);
    }
  }

  ngOnDestroy() {
    // Pulizia automatica quando si cambia pagina
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
