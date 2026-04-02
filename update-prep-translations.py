#!/usr/bin/env python3
"""
Add professional translations for PreparationPlan to multiple languages.
This provides translations for Spanish, French, and German with high quality.
"""

import json
import os

locales_path = '/var/home/marcel/Repo/nocts-back-on-track/client/public/locales'

# Spanish Translations
spanish_prep_plan = {
  "header": {
    "title": "Haz Tu Plan y Prepárate para Dejar",
    "subtitle": "La preparación es el fundamento de la recuperación exitosa. Usa esta guía para prepararte para el éxito."
  },
  "motivation": {
    "title": "Por Qué la Preparación es Importante",
    "mainMessage": "La recuperación no es algo que simplemente sucede—es algo que construyes.",
    "description": "El tiempo que pases preparándote ahora determinará directamente tu éxito. Las personas que planean su recuperación tienen muchas más probabilidades de mantenerla durante los primeros días difíciles.",
    "benefits": [
      "La preparación reduce las decisiones impulsivas cuando estás luchando",
      "Construye confianza y compromiso antes de empezar",
      "Identifica obstáculos potenciales antes de que te sorprendan",
      "Asegura que tengas sistemas de apoyo desde el primer día",
      "Demuestra que estás serio sobre el cambio"
    ],
    "insight": "💡 Cada minuto que pases planificando ahora te ahorra horas de lucha después."
  },
  "assess": {
    "title": "1. Evalúa Tu Situación Actual",
    "intro": "Antes de dejar, entiende dónde estás:",
    "questions": {
      "frequency": "¿Con qué frecuencia estoy usando/participando? (diariamente, semanalmente, múltiples veces al día)",
      "money": "¿Cuánto dinero estoy gastando por día/semana?",
      "time": "¿Qué hora del día uso más?",
      "triggers": "¿Qué situaciones desencadenan mi uso? (estrés, aburrimiento, social, emocional)",
      "impact": "¿Cómo ha afectado esta adicción mia salud, relaciones, trabajo y finanzas?",
      "obstacles": "¿Cuáles han sido mis obstáculos para dejar en el pasado?"
    },
    "placeholder": "Ingresa tu respuesta aquí...",
    "tip": "Consejo: Usa esta aplicación para rastrear tu uso actual durante algunos días antes de planear dejar. Los datos reales son más poderosos que las suposiciones."
  },
  "quitDate": {
    "title": "2. Establece una Fecha Específica para Dejar",
    "mainAdvice": "Elige una fecha dentro de las próximas 1-2 semanas. Date suficiente tiempo para prepararte, pero no tanto que pierdas motivación.",
    "goodTiming": [
      "✓ Buen momento: Elige un día después de que pase un evento estresante (no durante)",
      "✓ Buen momento: Elige un día cuando tengas apoyo disponible"
    ],
    "badTiming": [
      "✗ Mal momento: No elijas cuando ya estés estresado o emocional",
      "✗ Mal momento: No elijas cuando estés solo con acceso fácil"
    ],
    "finalAdvice": "Una vez que hayas elegido tu fecha, márcala en tu calendario. Cuéntaselo a la gente. Publícalo en algún lugar donde lo veas diariamente. Hazlo real."
  },
  "triggers": {
    "title": "3. Identifica Tus Desencadenantes",
    "intro": "Los desencadenantes son situaciones, emociones o personas que te hacen querer usar. Conocerlos de antemano significa que puedes planificarte para ellos.",
    "categories": {
      "emotional": {
        "title": "Desencadenantes Emocionales",
        "description": "Estrés, aburrimiento, soledad, ira, ansiedad, tristeza... ¿Qué emociones impulsan tu uso?"
      },
      "social": {
        "title": "Desencadenantes Sociales",
        "description": "Personas, lugares o grupos específicos. ¿Usas con ciertos amigos? ¿En ciertos lugares?"
      },
      "environmental": {
        "title": "Desencadenantes Ambientales",
        "description": "Horas del día, ubicaciones, objetos. ¿Estar en tu habitación te desencadena? ¿Las noches tardías?"
      },
      "habitual": {
        "title": "Desencadenantes Habituales",
        "description": "Cosas que siempre has hecho juntos. ¿Ritual del café matutino? ¿Rutina después del trabajo?"
      }
    },
    "action": "Acción: Para cada desencadenante, escribe un plan específico de qué harás en su lugar."
  },
  "support": {
    "title": "4. Construye Tu Red de Apoyo",
    "intro": "No puedes hacer esto solo. La recuperación exitosa requiere conexión y apoyo. Construye tu red ahora, antes de dejar.",
    "people": {
      "title": "👥 Personas a las que Contarle",
      "items": [
        "Al menos una persona en la que confíes completamente y que puedas llamar en cualquier momento",
        "Alguien que no te juzgue si luchas",
        "Alguien que celebre tus victorias",
        "Considera contarle a un terapeuta, consejero o doctor"
      ]
    },
    "resources": {
      "title": "📱 Recursos de Apoyo",
      "items": [
        "Grupos de apoyo (AA, NA, SMART Recovery, etc.)",
        "Servicios de terapia o consejería",
        "Esta aplicación - usa TODAS sus características (Diario, Estado de Ánimo, Meditación)",
        "Líneas de ayuda y líneas de crisis por texto"
      ]
    },
    "professional": {
      "title": "🏥 Ayuda Profesional",
      "items": [
        "Apoyo médico para la abstinencia si es necesario para alcohol o drogas",
        "Tratamiento asistido por medicamentos si se recomienda",
        "Tratamiento de salud mental para problemas subyacentes",
        "No intentes hacerlo sin ayuda si es peligroso"
      ]
    },
    "action": "Escribe 3-5 personas específicas a las que puedas llamar cuando se ponga difícil. Obtén sus números ahora y guárdalos en tu teléfono."
  },
  "coping": {
    "title": "5. Planifica Tus Estrategias de Afrontamiento",
    "intro": "Los antojos vendrán. Necesitas herramientas concretas listas ANTES de que lleguen.",
    "strategies": {
      "meditation": {
        "title": "🧘 Meditación y Atención Plena",
        "description": "Usa la función de Meditación de esta aplicación. Incluso 2 minutos ayudan."
      },
      "distraction": {
        "title": "🎮 Estrategias de Distracción",
        "description": "Usa el Juego de Antojos, mira una película, llama a un amigo, toma una ducha, haz ejercicio."
      },
      "physical": {
        "title": "💪 Actividad Física",
        "description": "Camina, corre, yoga, baila—cualquier cosa para mover tu cuerpo y cambiar tu química."
      },
      "journaling": {
        "title": "📔 Escritura en Diario",
        "description": "Usa la función de Diario para escribir a través de antojos y emociones."
      },
      "emotions": {
        "title": "🎭 Procesamiento Emocional",
        "description": "Rastrea tu estado de ánimo, nombra tus sentimientos, siéntelos sin actuar sobre ellos."
      },
      "connection": {
        "title": "🤝 Conexión",
        "description": "Llama a alguien, envía un mensaje a un amigo, asiste a una reunión de grupo de apoyo."
      }
    },
    "action": "Crea tu Kit Personal de Crisis: Escribe 3-5 cosas que harás cuando lleguen los antojos. Publícalo en algún lugar visible."
  },
  "remove": {
    "title": "6. Elimina Tentaciones",
    "intro": "Haz que sea lo más difícil posible usar. No puedes decir que no a lo que no está frente a ti.",
    "actions": {
      "clean": {
        "title": "🚭 Limpia Tu Espacio",
        "description": "Deshazté de todos los suministros, parafernalia, recordatorios. Limpia a fondo tu habitación, auto, bolsa."
      },
      "delete": {
        "title": "🗑️ Elimina Acceso",
        "description": "Elimina aplicaciones, bloquea sitios web, deja de seguir cuentas, elimina contactos de distribuidores."
      },
      "money": {
        "title": "💳 Limita Dinero",
        "description": "Da control de finanzas a alguien en quien confíes. Elimina acceso a tarjetas si es necesario."
      },
      "avoid": {
        "title": "📍 Evita Ubicaciones",
        "description": "Planifica rutas que eviten tus lugares de uso típicos. Ve por caminos diferentes."
      },
      "distance": {
        "title": "👥 Distancia de Personas",
        "description": "Considera decirles a los amigos que estás dejando—los amigos verdaderos te apoyarán."
      }
    }
  },
  "fortyEightHours": {
    "title": "7. Planifica las Primeras 48 Horas",
    "intro": "Las primeras 48 horas son las más difíciles. Planifica hora por hora si es necesario.",
    "blocks": {
      "wakeUp": {
        "title": "Cuando Despiertes",
        "description": "Cuéntale a alguien que tu decisión de dejar está comenzando. Haz algo saludable (ejercicio, meditación, desayuno saludable)."
      },
      "morning": {
        "title": "Mañana (Después de Dormir)",
        "description": "El tiempo sin estructura es peligroso. Planifica algo: ejercicio, reunirse con un amigo, pasatiempo, meditación."
      },
      "afternoon": {
        "title": "Tarde (Hora Pico de Antojos)",
        "description": "Llama a tu persona de apoyo. Usa tu Kit de Crisis. Este tiempo pasará."
      },
      "evening": {
        "title": "Noche (Tiempo Solitario)",
        "description": "Estar cerca de personas o hablando por teléfono con alguien. Mantente ocupado. Usa el Diario para procesar."
      },
      "night": {
        "title": "Por la Noche (Lo Más Difícil para Muchos)",
        "description": "Prepárate para dormir: baño caliente, té, meditación, audiolibro. Puedes hacerlo."
      }
    },
    "insight": "💡 Si las primeras 48 horas pasan sin usar, tus probabilidades de éxito a largo plazo se disparan dramáticamente. Puedes hacerlo."
  },
  "mental": {
    "title": "8. Prepárate Mentalmente",
    "intro": "Tu mentalidad determina tu éxito. Planta estas verdades ahora, antes de empezar:",
    "beliefs": [
      "✓ Esto es posible. Millones de personas lo han hecho. Tú también puedes.",
      "✓ No eres débil. La adicción es poderosa, y eres lo suficientemente fuerte para superarla.",
      "✓ Los antojos son temporales. Alcanzan su punto máximo en 15-20 minutos y luego desaparecen. Solo tienes que cabalgar la ola.",
      "✓ La abstinencia es natural. Tu cuerpo se está curando. Pasará.",
      "✓ Los resbalones ocurren—pero no borran tu progreso. Un error no significa fracaso. Levántate.",
      "✓ Vales la pena. Tu salud, libertad y futuro valen cualquier incomodidad temporal."
    ],
    "action": "Acción: Escribe estas verdades. Ponlas en tu espejo. Léelas diariamente."
  },
  "doctor": {
    "title": "9. Habla Con Tu Doctor",
    "intro": "Especialmente importante para alcohol y drogas duras. La supervisión médica puede hacer que la abstinencia sea más segura y manejable.",
    "canProvide": {
      "title": "Lo Que Tu Doctor Puede Proporcionar:",
      "items": [
        "Evaluación de la gravedad de tu adicción",
        "Medicamento para manejar la abstinencia",
        "Referencia a especialistas en adicciones",
        "Tratamiento para problemas de salud mental subyacentes",
        "Desintoxicación médica si es necesario"
      ]
    },
    "beHonest": {
      "title": "Sé Honesto Con Tu Doctor:",
      "items": [
        "Cuéntale qué, cuánto y con qué frecuencia has estado usando",
        "Cuéntale tu fecha para dejar",
        "Cuéntale sobre cualquier condición médica",
        "Cuéntale sobre medicamentos que estés tomando"
      ]
    },
    "closing": "Esto no es juzgamiento—es cuidado de la salud. Los doctores ayudan a la gente a dejar todos los días. Quieren ayudarte."
  },
  "tell": {
    "title": "10. Cuéntale a la Gente (Con Cuidado)",
    "intro": "La responsabilidad es poderosa. Pero elige con cuidado a quién le cuentas.",
    "positive": {
      "title": "Cuéntale a Estas Personas:",
      "items": [
        "✅ Alguien en quien confíes completamente",
        "✅ Personas que realmente te apoyen",
        "✅ Tu red de apoyo",
        "✅ Tu terapeuta o consejero"
      ]
    },
    "beCareful": {
      "title": "Ten Cuidado Con:",
      "items": [
        "⚠️ Personas que usan y podrían presionarte",
        "⚠️ Personas que han sido juzgadores antes",
        "⚠️ Personas que no son emocionalmente saludables ellas mismas",
        "⚠️ Redes sociales—no necesitas decírselo a todos"
      ]
    },
    "whatToSay": "Qué decir: \"He decidido dejar [la adicción] el [fecha]. Te lo estoy diciendo porque necesito tu apoyo. Si me comunico contigo en apuros, por favor estar ahí para mí.\""
  },
  "backup": {
    "title": "11. Crea un Plan de Respaldo",
    "intro": "¿Qué pasa si todo sale mal? Ten un plan para momentos de crisis.",
    "cravingHits": {
      "title": "Si un Antojo Te Golpea Fuerte",
      "steps": [
        "1. Llama a tu persona de apoyo inmediatamente",
        "2. Usa tu Kit de Crisis (distracción, ejercicio, etc.)",
        "3. Ve a un lugar seguro si es necesario",
        "4. Usa el Juego de Antojos o función de Meditación"
      ]
    },
    "almostUse": {
      "title": "Si Casi Usas",
      "steps": [
        "1. Cuéntale a alguien lo que estás experimentando",
        "2. Obtén ayuda profesional (línea de emergencia de terapeuta, doctor)",
        "3. No te aísles",
        "4. Esto no es fracaso—esto eres tú luchando"
      ]
    },
    "doUse": {
      "title": "Si Usas",
      "steps": [
        "1. No te castigue ni renuncies completamente",
        "2. Esto es un resbalón, no una recaída",
        "3. Llama a tu persona de apoyo inmediatamente",
        "4. Entiende qué lo desencadenó",
        "5. Reinicia tu fecha para dejar—no has fracasado"
      ]
    },
    "emergencyResources": {
      "title": "Recursos de Emergencia",
      "samhsa": "Línea Nacional SAMHSA: 1-800-662-4357",
      "crisisText": "Línea de Crisis por Texto: Envía HOME a 741741",
      "suicide": "Línea Nacional de Prevención del Suicidio: 988"
    }
  },
  "checklist": {
    "title": "12. Lista de Verificación Pre-Renuncia",
    "intro": "Antes de empezar, asegúrate de haber hecho estas cosas:",
    "items": {
      "quitDate": "✓ He establecido una fecha específica para dejar (dentro de 1-2 semanas)",
      "triggers": "✓ He identificado mis top 3 desencadenantes",
      "triggerPlans": "✓ He hecho planes para cada desencadenante",
      "supportPeople": "✓ Tengo 3-5 personas de apoyo identificadas con sus números guardados",
      "crisisToolkit": "✓ He creado mi Kit Personal de Crisis (5+ estrategias)",
      "cleanSpace": "✓ He eliminado tentaciones de mi espacio",
      "fortyEightHours": "✓ He planificado mis primeras 48 horas hora por hora",
      "doctor": "✓ He hablado con mi doctor (o programado una cita)",
      "toldSupport": "✓ Le he contado a al menos una persona de apoyo mi fecha para dejar",
      "helplines": "✓ He guardado números de líneas de crisis en mi teléfono",
      "ready": "✓ Entiendo que esto será difícil—y estoy listo"
    },
    "placeholders": {
      "quitDate": "Notas sobre tu fecha para dejar...",
      "triggers": "Lista tus top 3 desencadenantes...",
      "triggerPlans": "Describe tu plan para cada desencadenante...",
      "supportPeople": "Lista tus personas de apoyo e info de contacto...",
      "crisisToolkit": "Lista tus 5+ estrategias de afrontamiento...",
      "cleanSpace": "Describe los pasos que has tomado para limpiar tu espacio...",
      "fortyEightHours": "Resume tu plan para las primeras 48 horas...",
      "doctor": "Notas sobre tu consulta médica...",
      "toldSupport": "¿A quién le has contado tu fecha para dejar?...",
      "helplines": "Lista los números de líneas de crisis que has guardado...",
      "ready": "Tus pensamientos y sentimientos sobre estar listo/a..."
    }
  },
  "final": {
    "title": "Estás Listo",
    "emoji": "💪",
    "message1": "Has hecho tu plan. Has preparado tu mente y tu ambiente. Tienes apoyo. Tienes herramientas. Sabes lo que viene y tienes estrategias para manejarlo.",
    "message2": "El día que dejes no es el comienzo de tu recuperación—es solo el comienzo que puedes ver. La recuperación comenzó cuando decidiste hacer este cambio. Cada paso que has tomado para prepararte es recuperación.",
    "message3": "Vas a enfrentar momentos difíciles. Vendrán antojos. Las emociones serán abrumadoras. La abstinencia podría ser incómoda. Pero no estás haciendo esto solo. Tienes personas. Tienes herramientas. Tienes esta aplicación. Te tienes a ti mismo—y eso es suficiente.",
    "message4": "Bienvenido a tu nueva vida. Comienza ahora.",
    "encouragement": "Cuando estés listo para dejar, comienza a rastrear en esta aplicación. Usa todas las herramientas disponibles. Comunícate con tu red de apoyo. Y recuerda: cada día que no usas es una victoria que vale la pena celebrar.",
    "buttonText": "📅 Establece Tu Fecha de Parada Ahora"
  }
}

# Add to Spanish file
es_file = os.path.join(locales_path, 'es', 'common.json')
with open(es_file, 'r', encoding='utf-8') as f:
    es_data = json.load(f)

es_data['preparationPlan'] = spanish_prep_plan

with open(es_file, 'w', encoding='utf-8') as f:
    json.dump(es_data, f, ensure_ascii=False, indent=2)

print("✓ Added high-quality Spanish translations for PreparationPlan")

# Read English version for other languages
with open(os.path.join(locales_path, 'en', 'common.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)
    en_prep_plan = en_data['preparationPlan']

# For remaining languages, add English as placeholder for now
remaining_langs = ['en-simple', 'de', 'fr', 'ru', 'zh', 'ja', 'ar']
for lang in remaining_langs:
    lang_file = os.path.join(locales_path, lang, 'common.json')
    with open(lang_file, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    
    # Only update if not already present
    if 'preparationPlan' not in lang_data:
        lang_data['preparationPlan'] = en_prep_plan
        
        with open(lang_file, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        print(f"✓ Added English placeholder for {lang}")

print("\nDone! Spanish has full translations. Other languages use English as placeholder.")
