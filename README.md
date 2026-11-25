# JUSTIA — Del conocimiento jurídico a la acción ciudadana

**Plataforma jurídica colombiana integral.** Una sola conversación, un solo expediente, diez espacios conectados.

**Creadora:** Manuela Muriel Monsalve — Estudiante de Derecho.

---

## 1. Qué es JUSTIA

JUSTIA es una plataforma web que acompaña a una persona en Colombia desde que describe una situación jurídica en lenguaje cotidiano hasta que obtiene una explicación clara, fuentes oficiales, una ruta de actuación, posibles derechos y un borrador de documento.

No hay varios agentes: todo gira alrededor de un único agente central, **Guía de Derechos**, integrado en la aplicación. Su núcleo de prudencia, lenguaje probabilístico y mecanismos constitucionales viene de `guia-derechos-co.md`.

- **Orientación general y educativa.** No constituye asesoría jurídica profesional ni garantiza resultados.
- **Sin servidor:** funciona en el navegador y guarda la información solo en `localStorage`.
- **Sin dependencias de instalación.**

---

## 2. Cómo abrirla

Abre cualquiera de estas dos rutas en un navegador moderno:

- `index.html` (entrada de la raíz)
- `justia/index.html` (aplicación dentro de la carpeta)

Ambas muestran la misma plataforma. Las rutas relativas ya están ajustadas para cada ubicación.

---

## 3. Los diez espacios

La barra lateral organiza la plataforma. Cada espacio tiene identidad, instrucciones, ejemplos y elementos interactivos propios, y ninguno queda aislado del agente central.

| Espacio | Función principal |
| --- | --- |
| **Inicio** | Portada amplia con el buscador «¿En qué situación jurídica podemos ayudarte hoy?», accesos directos, áreas del Derecho, FAQ, orientación destacada, DERECHOS 360 y consejos jurídicos. Incluye la tarjeta **Tu expediente** con ilustración y avance del caso. |
| **Orientador jurídico** | Explicación guiada por secciones desplegables, flujo de 8 pasos, preguntas de seguimiento y acciones para continuar en otro espacio. |
| **Traductor jurídico** | Texto resaltado, versión en claro, explicación normativa, ejemplo, glosario bilingüe y copia al portapapeles. |
| **Constructor de documentos** | Catálogo de 8 plantillas, formulario dinámico, vista previa editable, guardado local, copia, descarga y impresión. |
| **Buscador de legislación y jurisprudencia** | Filtros por tipo, entidad, año y área; normas marcadas como pendientes de verificación y búsquedas sugeridas en portales oficiales. |
| **Simulador de rutas legales** | Ruta visual por etapas, progreso, entidades, documentos, alternativas y avance interactivo. |
| **Analizador de casos y riesgos** | Nivel de urgencia, riesgos detectados, hechos ordenados, partes y niveles de certeza. |
| **Derechos 360** | Derechos presuntamente afectados, mecanismos, entidades, escalamiento y líneas de emergencia (123/112 y 147). |
| **Mis consultas y documentos** | Historial de análisis y borradores guardados; permite reabrir o eliminar registros. |
| **Centro de ayuda** | Guía rápida, preguntas frecuentes, glosario con buscador y contactos oficiales. |

### Integración real entre espacios

El expediente compartido se transforma en acciones concretas: **Analizar este caso**, **Consultar fundamento jurídico**, **Crear documento**, **Ver ruta de actuación** e **Identificar mis derechos**. Al pasar de un espacio a otro no se pierde información ni se repiten preguntas.

---

## 4. Flujo de atención

Ante cualquier consulta se ejecuta este orden:

1. Escuchar la situación en lenguaje cotidiano.
2. Identificar el área jurídica.
3. Analizar hechos, partes, riesgos y niveles de certeza.
4. Consultar legislación y jurisprudencia en fuentes oficiales.
5. Identificar derechos, deberes y prohibiciones.
6. Determinar mecanismos, entidades y ruta de actuación.
7. Elaborar un documento editable cuando se necesite.
8. Explicar el siguiente paso concreto.

El flujo completo lo coordina `justia/js/orchestrator.js`, que alimenta el objeto `Caso` compartido.

---

## 5. Identidad visual

- **Paleta:** rosa pastel `#F4DDE5`, rosa empolvado `#D9A6B5`, azul cielo `#DCEAF7`, azul gris `#A9BED3`, blanco `#FFFFFF` y negro suave `#25252B`.
- **Tipografías:** Playfair Display (titulares), Poppins (cuerpo) e Inter (interfaz).
- **Ilustración de la tarjeta Tu expediente:** `justia/assets/expediente-justia.svg`, una carpeta con papeles, pluma, balanza y sello dibujada en vector con la misma paleta. Se integra como cabecera compacta de la tarjeta.
- **Modo claro y oscuro**, idiomas **ES/EN**, diseño adaptable a móvil, animaciones sutiles y estilos de impresión.
- Preferencias de tema e idioma persistentes; la credencial de la creadora aparece en la interfaz.

---

## 6. Estructura del proyecto

```text
.
├── index.html                     Entrada raíz de la plataforma
├── justia.md                      Definición del agente, flujo y reglas
├── guia-derechos-co.md            Núcleo heredado de prudencia y mecanismos
├── guia-derechos-landing.html     Landing anterior (conservado)
├── justia/
│   ├── index.html                 Aplicación con barra lateral y diez vistas
│   ├── styles.css                 Sistema visual pastel, responsive e impresión
│   ├── README.md                  Documentación específica de la aplicación
│   ├── assets/
│   │   └── expediente-justia.svg  Ilustración de la tarjeta Tu expediente
│   ├── js/
│   │   ├── core.js                Utilidades y textos bilingües
│   │   ├── state.js               Expediente compartido y preferencias
│   │   ├── analyzer.js            Clasificación, hechos, urgencia y riesgos
│   │   ├── sources.js             Catálogo de normas y portales oficiales
│   │   ├── routes.js              Simulador de rutas por etapas
│   │   ├── documents.js           Plantillas y generación de escritos
│   │   ├── rights360.js           Derechos, mecanismos y escalamiento
│   │   ├── translator.js          Traducción y glosario bilingüe
│   │   ├── orchestrator.js        Flujo único de 8 pasos
│   │   └── ui.js                  Renderizado, integraciones e interacción
│   └── tests/smoke.js             54 pruebas de integración
├── skill 1/                       Biblioteca de origen (conservada)
├── skill 2/                       Biblioteca de origen (conservada)
└── skill 3/                       Base de conocimiento: 35 temas, 9 áreas, glosario y motor
```

Los archivos `app.js`, `datos.js`, `compilar.js`, `generar-datos.js` y los archivos compilados de la raíz pertenecen a la base original; JUSTIA los conserva como fuente, no los ejecuta como agentes separados.

---

## 7. Responsabilidad y privacidad

- Las normas se presentan como **referencia de orientación · texto vigente por verificar**, con enlaces a SUIN-Juriscol, Corte Constitucional, Corte Suprema de Justicia, Consejo de Estado y Función Pública.
- **Ninguna sentencia se muestra como fallo verificado.** La jurisprudencia se entrega como búsquedas sugeridas en portales oficiales.
- Se distinguen hechos aportados, afirmaciones del usuario y conclusiones preliminares.
- Se prioriza la atención urgente (123/112) y se recomienda la Defensoría del Pueblo (147), Personería, consultorios jurídicos o abogado en asuntos complejos.
- No se piden claves ni datos sensibles innecesarios. Todo permanece en el navegador del usuario.

> La verificación en línea de normas quedó pendiente porque el entorno de construcción no permitió consultar los portales oficiales. Por eso la aplicación marca cada referencia como pendiente de verificación en lugar de afirmar su vigencia.

---

## 8. Verificación

```bash
node justia/tests/smoke.js
node "skill 3/tests/smoke.js"
```

Resultados actuales:

| Comprobación | Resultado |
| --- | --- |
| Pruebas de integración de JUSTIA | **54/54** |
| Pruebas del motor de base | **35/35** |
| Simulación de interfaz sin navegador | **11/11** |
| Claves bilingües, navegación y acciones | Todas pasaron (144 claves) |
| Referencias locales en ambos `index.html` | 19/19, **0 faltantes** |
| Sintaxis de todos los archivos JavaScript | Sin errores |

---

## 9. Estado final

Plataforma terminada: diez vistas conectadas, flujo de 8 pasos, integraciones entre funciones, tema claro/oscuro, ES/EN, responsive, historial y documentos persistidos localmente, ilustración del expediente y tarjeta compacta. Lista para abrir en `index.html` o `justia/index.html`.
