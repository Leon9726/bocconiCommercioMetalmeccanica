import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {Location} from "@angular/common";

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  fullContent: string;
  translations?: {
    [locale: string]: {
      title: string;
      description: string;
      features: string[];
      fullContent: string;
    }
  };
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  imports: [
    RouterLink,
    TranslateModule
  ],
  standalone: true
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | undefined;
  private langChangeSub: Subscription | undefined;

  private services: Service[] = [
    {
      id: 'soccorso-stradale',
      title: 'Soccorso Stradale',
      icon: '🚨',
      description: 'Intervento rapido per soccorso stradale di auto, furgoni e veicoli industriali.',
      features: ['Assistenza 24/7', 'Recupero veicoli incidentati', 'Trasporto in officina', 'Intervento rapido'],
      fullContent: 'Il servizio di soccorso stradale BOCCONI COMMERCIO e METALMECCANICA SRL garantisce un intervento tempestivo e sicuro per il recupero di veicoli in avaria o incidentati.',
      translations: {
        en: {
          title: 'Roadside Assistance',
          description: 'Fast response for roadside assistance of cars, vans, and industrial vehicles.',
          features: ['24/7 Assistance', 'Recovery of crashed vehicles', 'Transport to workshop', 'Fast response'],
          fullContent: 'BOCCONI COMMERCIO e METALMECCANICA SRL roadside assistance service ensures a timely and safe response for the recovery of broken down or crashed vehicles.'
        }
      }
    },
    {
      id: 'lavaggio',
      title: 'Lavaggio Industriale e Auto',
      icon: '🚿',
      description: 'Servizio di lavaggio per auto e veicoli industriali.',
      features: ['Lavaggio esterni', 'Pulizia interni', 'Sanificazione', 'Lavaggio per mezzi pesanti'],
      fullContent: 'Offriamo un servizio completo di lavaggio e sanificazione per ogni tipologia di veicolo, dalle auto ai mezzi industriali.',
      translations: {
        en: {
          title: 'Industrial and Car Wash',
          description: 'Washing service for cars and industrial vehicles.',
          features: ['Exterior washing', 'Interior cleaning', 'Sanitization', 'Heavy vehicle washing'],
          fullContent: 'We offer a complete washing and sanitization service for all types of vehicles, from cars to industrial vehicles.'
        }
      }
    },
    {
      id: 'noleggio',
      title: 'Noleggio Auto - Furgoni - Gru - Escavatori',
      icon: '🔑',
      description: 'Noleggio auto, furgoni 9 posti, gru, piattaforme aeree, escavatori e muletti.',
      features: ['Auto e furgoni', 'Gru e piattaforme aeree', 'Escavatori e macchine movimento terra', 'Muletti'],
      fullContent: 'Ampia flotta a noleggio per soddisfare le esigenze di privati e aziende: auto, veicoli commerciali, mezzi di sollevamento e macchine operatrici.',
      translations: {
        en: {
          title: 'Car - Van - Crane - Excavator Rental',
          description: 'Rental of cars, 9-seater vans, cranes, aerial platforms, excavators and forklifts.',
          features: ['Cars and vans', 'Cranes and aerial platforms', 'Excavators and earthmoving machinery', 'Forklifts'],
          fullContent: 'Large rental fleet to meet the needs of individuals and companies: cars, commercial vehicles, lifting equipment and operating machines.'
        }
      }
    }
  ];

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.updateService(id);
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      const id = this.route.snapshot.params['id'];
      this.updateService(id);
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  private updateService(id: string): void {
    const rawService = this.services.find(s => s.id === id);
    if (rawService) {
      this.service = this.localizeService(rawService);
    }
  }

  private localizeService(service: Service): Service {
    const currentLang = this.translate.currentLang || 'it';
    if (currentLang === 'en' && service.translations?.['en']) {
      return {
        ...service,
        ...service.translations['en']
      };
    }
    return service;
  }

  closeModal(): void {
    this.location.back();
  }
}
