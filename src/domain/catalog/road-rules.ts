export type AppLocale = "en" | "ar" | "es" | "pt" | "fr";

export type ContinentKey = "asia" | "middleEast" | "europe" | "northAmerica";

export const CONTINENTS: ContinentKey[] = [
  "asia",
  "middleEast",
  "europe",
  "northAmerica",
];

export interface RoadRuleSubsection {
  subtitle: string;
  bullets: string[];
}

export interface RoadRuleSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: RoadRuleSubsection[];
}

export interface LocalizedRoadRuleGuide {
  heading: string;
  subtitle: string;
  sections: RoadRuleSection[];
}

export interface RoadRuleCountryMeta {
  id: string;
  continentKey: ContinentKey;
  countryKey: string;
  countryCode: string;
  pdfUrls: Partial<Record<AppLocale, string>> & { en: string };
  pdfFileName: string;
  updatedAt: string;
}

export interface RoadRuleCountryRecord extends RoadRuleCountryMeta {
  guides: Partial<Record<AppLocale, LocalizedRoadRuleGuide>> & {
    en: LocalizedRoadRuleGuide;
  };
}

// Exact single-locale shape your backend API will return later
export interface RoadRuleCountryView {
  id: string;
  continentKey: ContinentKey;
  countryKey: string;
  countryCode: string;
  pdfUrl: string;
  pdfFileName: string;
  updatedAt: string;
  guide: LocalizedRoadRuleGuide;
}

export const ROAD_RULES_DATA: RoadRuleCountryRecord[] = [
  {
    id: "pakistan",
    continentKey: "asia",
    countryKey: "pakistan",
    countryCode: "PK",
    pdfUrls: {
      en: "/pdfs/road-rules/pakistan-en.pdf",
      ar: "/pdfs/road-rules/pakistan-ar.pdf",
      es: "/pdfs/road-rules/pakistan-es.pdf",
      pt: "/pdfs/road-rules/pakistan-pt.pdf",
      fr: "/pdfs/road-rules/pakistan-fr.pdf",
    },
    pdfFileName: "pakistan-road-rules.pdf",
    updatedAt: "2026-01-15",
    guides: {
      en: {
        heading: "Driving in Pakistan",
        subtitle:
          "Key road regulations, speed limits, and safety requirements for driving across Pakistan.",
        sections: [
          {
            id: "general",
            title: "General Driving Rules",
            bullets: [
              "Drive on the left side of the road and overtake on the right.",
              "Seat belts are mandatory for the driver and front passenger.",
              "Using a handheld mobile phone while driving is prohibited.",
            ],
          },
          {
            id: "speed-limits",
            title: "Speed Limits",
            bullets: [
              "Urban areas: 40–60 km/h unless posted otherwise.",
              "Highways & GT Road: 80–100 km/h for passenger cars.",
              "Motorways (M-1, M-2, etc.): Up to 120 km/h for cars.",
            ],
          },
          {
            id: "documents",
            title: "Required Documents",
            paragraphs: [
              "Drivers must carry a valid driving license (or International Driving Permit for foreign visitors), vehicle registration book/smart card, and valid insurance.",
            ],
          },
        ],
      },
      ar: {
        heading: "القيادة في باكستان",
        subtitle:
          "أهم أنظمة المرور وحدود السرعة ومتطلبات السلامة للقيادة في باكستان.",
        sections: [
          {
            id: "general",
            title: "قواعد القيادة العامة",
            bullets: [
              "القيادة على الجانب الأيسر من الطريق والتجاوز من اليمين.",
              "ربط حزام الأمان إلزامي للسائق والراكب الأمامي.",
              "يُمنع استخدام الهاتف المحمول باليد أثناء القيادة.",
            ],
          },
          {
            id: "speed-limits",
            title: "حدود السرعة",
            bullets: [
              "المناطق الحضرية: 40–60 كم/ساعة ما لم يُذكر خلاف ذلك.",
              "الطرق السريعة: 80–100 كم/ساعة للسيارات.",
              "الطرق السيارة (Motorways): حتى 120 كم/ساعة للسيارات.",
            ],
          },
          {
            id: "documents",
            title: "المستندات المطلوبة",
            paragraphs: [
              "يجب على السائق حمل رخصة قيادة سارية (أو رخصة قيادة دولية للزوار)، وبطاقة تسجيل المركبة، وتأمين ساري المفعول.",
            ],
          },
        ],
      },
      es: {
        heading: "Conducir en Pakistán",
        subtitle:
          "Normas viales clave, límites de velocidad y requisitos de seguridad para conducir en Pakistán.",
        sections: [
          {
            id: "general",
            title: "Normas generales de conducción",
            bullets: [
              "Conduzca por el lado izquierdo de la calzada y adelante por la derecha.",
              "El cinturón de seguridad es obligatorio para el conductor y el pasajero delantero.",
              "Está prohibido usar el teléfono móvil en la mano mientras se conduce.",
            ],
          },
          {
            id: "speed-limits",
            title: "Límites de velocidad",
            bullets: [
              "Zonas urbanas: 40–60 km/h salvo que se indique lo contrario.",
              "Carreteras y GT Road: 80–100 km/h para turismos.",
              "Autopistas (M-1, M-2, etc.): hasta 120 km/h para automóviles.",
            ],
          },
          {
            id: "documents",
            title: "Documentos requeridos",
            paragraphs: [
              "Los conductores deben llevar un permiso de conducir válido (o Permiso Internacional de Conducción para visitantes extranjeros), el documento o tarjeta inteligente de matriculación del vehículo y un seguro vigente.",
            ],
          },
        ],
      },
      pt: {
        heading: "Dirigir no Paquistão",
        subtitle:
          "Principais regulamentações de trânsito, limites de velocidade e requisitos de segurança para dirigir no Paquistão.",
        sections: [
          {
            id: "general",
            title: "Regras gerais de direção",
            bullets: [
              "Dirija pelo lado esquerdo da via e ultrapasse pela direita.",
              "O cinto de segurança é obrigatório para o motorista e o passageiro dianteiro.",
              "É proibido usar o celular na mão enquanto dirige.",
            ],
          },
          {
            id: "speed-limits",
            title: "Limites de velocidade",
            bullets: [
              "Áreas urbanas: 40–60 km/h, salvo sinalização contrária.",
              "Rodovias e GT Road: 80–100 km/h para carros de passeio.",
              "Autoestradas (M-1, M-2, etc.): até 120 km/h para carros.",
            ],
          },
          {
            id: "documents",
            title: "Documentos obrigatórios",
            paragraphs: [
              "Os motoristas devem portar carteira de habilitação válida (ou Permissão Internacional para Dirigir para visitantes estrangeiros), documento/cartão inteligente de registro do veículo e seguro válido.",
            ],
          },
        ],
      },
      fr: {
        heading: "Conduire au Pakistan",
        subtitle:
          "Principales règles de circulation, limitations de vitesse et exigences de sécurité pour conduire au Pakistan.",
        sections: [
          {
            id: "general",
            title: "Règles générales de conduite",
            bullets: [
              "Conduisez sur le côté gauche de la route et dépassez par la droite.",
              "Le port de la ceinture de sécurité est obligatoire pour le conducteur et le passager avant.",
              "L'utilisation d'un téléphone portable tenu en main est interdite au volant.",
            ],
          },
          {
            id: "speed-limits",
            title: "Limitations de vitesse",
            bullets: [
              "Zones urbaines : 40–60 km/h sauf indication contraire.",
              "Routes nationales et GT Road : 80–100 km/h pour les voitures particulières.",
              "Autoroutes (M-1, M-2, etc.) : jusqu'à 120 km/h pour les voitures.",
            ],
          },
          {
            id: "documents",
            title: "Documents requis",
            paragraphs: [
              "Les conducteurs doivent être munis d'un permis de conduire valide (ou d'un permis international pour les visiteurs étrangers), du certificat ou de la carte d'immatriculation du véhicule et d'une assurance valide.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "uae",
    continentKey: "middleEast",
    countryKey: "uae",
    countryCode: "AE",
    pdfUrls: {
      en: "/pdfs/road-rules/uae-en.pdf",
      ar: "/pdfs/road-rules/uae-ar.pdf",
      es: "/pdfs/road-rules/uae-es.pdf",
      pt: "/pdfs/road-rules/uae-pt.pdf",
      fr: "/pdfs/road-rules/uae-fr.pdf",
    },
    pdfFileName: "uae-road-rules.pdf",
    updatedAt: "2026-01-15",
    guides: {
      en: {
        heading: "Driving in the United Arab Emirates",
        subtitle:
          "Essential traffic regulations, Salik/Darb tolls, and zero-tolerance laws across the UAE.",
        sections: [
          {
            id: "general",
            title: "General Driving Rules",
            bullets: [
              "Drive on the right side of the road.",
              "Seat belts are mandatory for all passengers, front and rear.",
              "Strict zero-tolerance policy for driving under the influence of alcohol.",
            ],
          },
          {
            id: "speed-limits",
            title: "Speed Limits",
            bullets: [
              "Urban roads: 40–80 km/h.",
              "Major highways: 100–140 km/h (Abu Dhabi has no 20 km/h radar buffer).",
            ],
          },
        ],
      },
      ar: {
        heading: "القيادة في الإمارات العربية المتحدة",
        subtitle:
          "أهم قوانين المرور ونظام التعرفة المرورية (سالك/درب) وقواعد السلامة في الإمارات.",
        sections: [
          {
            id: "general",
            title: "قواعد القيادة العامة",
            bullets: [
              "القيادة على الجانب الأيمن من الطريق.",
              "ربط حزام الأمان إلزامي لجميع الركاب في الأمام والخلف.",
              "تطبيق سياسة عدم التسامح مطلقاً مع القيادة تحت تأثير الكحول.",
            ],
          },
          {
            id: "speed-limits",
            title: "حدود السرعة",
            bullets: [
              "الطرق الداخلية: 40–80 كم/ساعة.",
              "الطرق السريعة الرئيسية: 100–140 كم/ساعة (لا يوجد هامش سرعة في أبوظبي).",
            ],
          },
        ],
      },
      es: {
        heading: "Conducir en los Emiratos Árabes Unidos",
        subtitle:
          "Normas de tráfico esenciales, peajes Salik/Darb y leyes de tolerancia cero en los EAU.",
        sections: [
          {
            id: "general",
            title: "Normas generales de conducción",
            bullets: [
              "Conduzca por el lado derecho de la carretera.",
              "El cinturón de seguridad es obligatorio para todos los pasajeros, tanto delante como detrás.",
              "Política estricta de tolerancia cero frente a la conducción bajo los efectos del alcohol.",
            ],
          },
          {
            id: "speed-limits",
            title: "Límites de velocidad",
            bullets: [
              "Vías urbanas: 40–80 km/h.",
              "Autopistas principales: 100–140 km/h (Abu Dabi no aplica margen de radar de 20 km/h).",
            ],
          },
        ],
      },
      pt: {
        heading: "Dirigir nos Emirados Árabes Unidos",
        subtitle:
          "Regras essenciais de trânsito, pedágios Salik/Darb e leis de tolerância zero nos Emirados Árabes Unidos.",
        sections: [
          {
            id: "general",
            title: "Regras gerais de direção",
            bullets: [
              "Dirija pelo lado direito da via.",
              "O cinto de segurança é obrigatório para todos os passageiros, nos bancos dianteiros e traseiros.",
              "Política rigorosa de tolerância zero para direção sob efeito de álcool.",
            ],
          },
          {
            id: "speed-limits",
            title: "Limites de velocidade",
            bullets: [
              "Vias urbanas: 40–80 km/h.",
              "Principais rodovias: 100–140 km/h (Abu Dhabi não possui margem de tolerância de 20 km/h nos radares).",
            ],
          },
        ],
      },
      fr: {
        heading: "Conduire aux Émirats arabes unis",
        subtitle:
          "Règles de circulation essentielles, péages Salik/Darb et lois de tolérance zéro aux Émirats arabes unis.",
        sections: [
          {
            id: "general",
            title: "Règles générales de conduite",
            bullets: [
              "Conduisez sur le côté droit de la route.",
              "Le port de la ceinture de sécurité est obligatoire pour tous les passagers, à l'avant comme à l'arrière.",
              "Politique stricte de tolérance zéro concernant la conduite sous l'emprise de l'alcool.",
            ],
          },
          {
            id: "speed-limits",
            title: "Limitations de vitesse",
            bullets: [
              "Routes urbaines : 40–80 km/h.",
              "Grands axes autoroutiers : 100–140 km/h (Abou Dabi n'applique aucune marge radar de 20 km/h).",
            ],
          },
        ],
      },
    },
  },
  {
    id: "uk",
    continentKey: "europe",
    countryKey: "uk",
    countryCode: "GB",
    pdfUrls: {
      en: "/pdfs/road-rules/uk-en.pdf",
      ar: "/pdfs/road-rules/uk-ar.pdf",
      es: "/pdfs/road-rules/uk-es.pdf",
      pt: "/pdfs/road-rules/uk-pt.pdf",
      fr: "/pdfs/road-rules/uk-fr.pdf",
    },
    pdfFileName: "uk-road-rules.pdf",
    updatedAt: "2026-01-15",
    guides: {
      en: {
        heading: "Driving in the United Kingdom",
        subtitle:
          "Highway Code highlights, roundabout etiquette, and UK speed limits.",
        sections: [
          {
            id: "general",
            title: "General Driving Rules",
            bullets: [
              "Drive on the left side of the road.",
              "Give way to traffic approaching from the right at roundabouts.",
              "Speed limits and distances are posted in miles per hour (mph).",
            ],
          },
          {
            id: "speed-limits",
            title: "National Speed Limits (Cars)",
            bullets: [
              "Built-up areas: 30 mph (20 mph in many city zones).",
              "Single carriageways: 60 mph.",
              "Dual carriageways & motorways: 70 mph.",
            ],
          },
        ],
      },
      ar: {
        heading: "القيادة في المملكة المتحدة",
        subtitle:
          "أبرز قواعد قانون الطرق السريعة، أولوية الدوارات، وحدود السرعة في بريطانيا.",
        sections: [
          {
            id: "general",
            title: "قواعد القيادة العامة",
            bullets: [
              "القيادة على الجانب الأيسر من الطريق.",
              "إعطاء الأولوية للمركبات القادمة من اليمين عند الدوارات.",
              "تُقاس حدود السرعة والمسافات بالميل في الساعة (mph).",
            ],
          },
          {
            id: "speed-limits",
            title: "حدود السرعة (للسيارات)",
            bullets: [
              "المناطق السكنية: 30 ميلاً/ساعة (و20 ميلاً/ساعة في بعض المناطق).",
              "الطرق المفردة: 60 ميلاً/ساعة.",
              "الطرق المزدوجة والسريعة: 70 ميلاً/ساعة.",
            ],
          },
        ],
      },
      es: {
        heading: "Conducir en el Reino Unido",
        subtitle:
          "Aspectos clave del Código de Circulación, prioridad en rotondas y límites de velocidad en el Reino Unido.",
        sections: [
          {
            id: "general",
            title: "Normas generales de conducción",
            bullets: [
              "Conduzca por el lado izquierdo de la carretera.",
              "Ceda el paso al tráfico que se aproxima por la derecha en las rotondas.",
              "Los límites de velocidad y las distancias se indican en millas por hora (mph).",
            ],
          },
          {
            id: "speed-limits",
            title: "Límites nacionales de velocidad (automóviles)",
            bullets: [
              "Zonas urbanas: 30 mph (20 mph en muchas áreas de la ciudad).",
              "Carreteras de calzada única: 60 mph.",
              "Autovías de doble calzada y autopistas: 70 mph.",
            ],
          },
        ],
      },
      pt: {
        heading: "Dirigir no Reino Unido",
        subtitle:
          "Destaques do Código Rodoviário, prioridade em rotatórias e limites de velocidade no Reino Unido.",
        sections: [
          {
            id: "general",
            title: "Regras gerais de direção",
            bullets: [
              "Dirija pelo lado esquerdo da via.",
              "Dê preferência ao tráfego que se aproxima pela direita nas rotatórias.",
              "Os limites de velocidade e as distâncias são sinalizados em milhas por hora (mph).",
            ],
          },
          {
            id: "speed-limits",
            title: "Limites nacionais de velocidade (carros)",
            bullets: [
              "Áreas urbanas: 30 mph (20 mph em várias zonas centrais).",
              "Vias de pista simples: 60 mph.",
              "Vias de pista dupla e autoestradas: 70 mph.",
            ],
          },
        ],
      },
      fr: {
        heading: "Conduire au Royaume-Uni",
        subtitle:
          "Points clés du Code de la route britannique, règles des ronds-points et limitations de vitesse au Royaume-Uni.",
        sections: [
          {
            id: "general",
            title: "Règles générales de conduite",
            bullets: [
              "Conduisez sur le côté gauche de la route.",
              "Cédez le passage aux véhicules venant de la droite dans les ronds-points.",
              "Les limitations de vitesse et les distances sont indiquées en miles par heure (mph).",
            ],
          },
          {
            id: "speed-limits",
            title: "Limitations de vitesse nationales (voitures)",
            bullets: [
              "Agglomérations : 30 mph (20 mph dans de nombreuses zones urbaines).",
              "Routes à chaussée unique : 60 mph.",
              "Routes à deux chaussées et autoroutes : 70 mph.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "usa",
    continentKey: "northAmerica",
    countryKey: "usa",
    countryCode: "US",
    pdfUrls: {
      en: "/pdfs/road-rules/usa-en.pdf",
      ar: "/pdfs/road-rules/usa-ar.pdf",
      es: "/pdfs/road-rules/usa-es.pdf",
      pt: "/pdfs/road-rules/usa-pt.pdf",
      fr: "/pdfs/road-rules/usa-fr.pdf",
    },
    pdfFileName: "usa-road-rules.pdf",
    updatedAt: "2026-01-15",
    guides: {
      en: {
        heading: "Driving in the United States",
        subtitle:
          "Key federal and state-level driving norms, school bus laws, and highway rules.",
        sections: [
          {
            id: "general",
            title: "General Driving Rules",
            bullets: [
              "Drive on the right side of the road.",
              "You must come to a complete stop for school buses with flashing red lights.",
              "Right turn on red is generally permitted after a full stop unless signs prohibit it.",
            ],
          },
          {
            id: "speed-limits",
            title: "Typical Speed Limits",
            bullets: [
              "Residential & school zones: 15–35 mph.",
              "Interstate highways: 55–75 mph depending on the state.",
            ],
          },
        ],
      },
      ar: {
        heading: "القيادة في الولايات المتحدة الأمريكية",
        subtitle:
          "أبرز قواعد القيادة الفيدرالية وعلى مستوى الولايات، وقوانين الحافلات المدرسية والطرق السريعة.",
        sections: [
          {
            id: "general",
            title: "قواعد القيادة العامة",
            bullets: [
              "القيادة على الجانب الأيمن من الطريق.",
              "يجب التوقف تماماً عند توقف الحافلات المدرسية وتشغيل أضوائها الحمراء الوامضة.",
              "يُسمح عادةً بالانعطاف يميناً عند الإشارة الحمراء بعد التوقف التام ما لم توجد لوحة تمنع ذلك.",
            ],
          },
          {
            id: "speed-limits",
            title: "حدود السرعة الشائعة",
            bullets: [
              "المناطق السكنية ومحيط المدارس: 15–35 ميلاً/ساعة.",
              "الطرق السريعة بين الولايات: 55–75 ميلاً/ساعة حسب الولاية.",
            ],
          },
        ],
      },
      es: {
        heading: "Conducir en los Estados Unidos",
        subtitle:
          "Normas clave federales y estatales de conducción, leyes sobre autobuses escolares y reglas en autopistas.",
        sections: [
          {
            id: "general",
            title: "Normas generales de conducción",
            bullets: [
              "Conduzca por el lado derecho de la carretera.",
              "Debe detenerse por completo ante los autobuses escolares con luces rojas intermitentes.",
              "Por lo general se permite girar a la derecha en luz roja tras detenerse por completo, salvo que una señal lo prohíba.",
            ],
          },
          {
            id: "speed-limits",
            title: "Límites de velocidad habituales",
            bullets: [
              "Zonas residenciales y escolares: 15–35 mph.",
              "Autopistas interestatales: 55–75 mph según el estado.",
            ],
          },
        ],
      },
      pt: {
        heading: "Dirigir nos Estados Unidos",
        subtitle:
          "Principais normas federais e estaduais de direção, leis de ônibus escolares e regras nas rodovias.",
        sections: [
          {
            id: "general",
            title: "Regras gerais de direção",
            bullets: [
              "Dirija pelo lado direito da via.",
              "Você deve parar completamente para ônibus escolares com luzes vermelhas piscando.",
              "A conversão à direita no sinal vermelho geralmente é permitida após parada total, salvo sinalização proibitiva.",
            ],
          },
          {
            id: "speed-limits",
            title: "Limites de velocidade típicos",
            bullets: [
              "Áreas residenciais e escolares: 15–35 mph.",
              "Rodovias interestaduais: 55–75 mph, dependendo do estado.",
            ],
          },
        ],
      },
      fr: {
        heading: "Conduire aux États-Unis",
        subtitle:
          "Principales règles de conduite fédérales et étatiques, lois sur les bus scolaires et règles autoroutières.",
        sections: [
          {
            id: "general",
            title: "Règles générales de conduite",
            bullets: [
              "Conduisez sur le côté droit de la route.",
              "Vous devez marquer un arrêt complet pour les bus scolaires dont les feux rouges clignotent.",
              "Le virage à droite au feu rouge est généralement autorisé après un arrêt complet, sauf panneau d'interdiction.",
            ],
          },
          {
            id: "speed-limits",
            title: "Limitations de vitesse courantes",
            bullets: [
              "Zones résidentielles et scolaires : 15–35 mph.",
              "Autoroutes inter-États : 55–75 mph selon l'État.",
            ],
          },
        ],
      },
    },
  },
];

export function getRoadRulesByLocale(locale: AppLocale): RoadRuleCountryView[] {
  return ROAD_RULES_DATA.map((country) => ({
    id: country.id,
    continentKey: country.continentKey,
    countryKey: country.countryKey,
    countryCode: country.countryCode,
    pdfUrl: country.pdfUrls[locale] ?? country.pdfUrls.en,
    pdfFileName: country.pdfFileName,
    updatedAt: country.updatedAt,
    guide: country.guides[locale] ?? country.guides.en,
  }));
}
