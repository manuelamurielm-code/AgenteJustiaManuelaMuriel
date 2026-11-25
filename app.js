/* Landing page del agente compilado Guía de Derechos Colombia.
   Toda la información jurídica se toma de window.GUIA_DATOS (generado desde el JSON compilado). */
(function () {
  'use strict';

  const D = window.GUIA_DATOS;
  if (!D) {
    console.error('No se cargó datos.js. Ejecuta: node generar-datos.js');
    return;
  }

  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const NS = 'http://www.w3.org/2000/svg';

  function crear(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  function icono(id, clase) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', clase || 'icon');
    const uso = document.createElementNS(NS, 'use');
    uso.setAttribute('href', '#' + id);
    svg.appendChild(uso);
    return svg;
  }

  function capitalizar(texto) {
    return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : '';
  }

  function reemplazar(contenedor, nodo) {
    while (contenedor.firstChild) contenedor.removeChild(contenedor.firstChild);
    contenedor.appendChild(nodo);
  }

  /* ---------- Tema ---------- */
  const raiz = document.documentElement;
  const botonTema = $('#tema');
  const guardado = localStorage.getItem('guia-tema');
  if (guardado === 'claro' || guardado === 'noche') {
    raiz.dataset.theme = guardado;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    raiz.dataset.theme = 'noche';
  }

  function sincronizarTema() {
    const esNoche = raiz.dataset.theme === 'noche';
    const uso = botonTema.querySelector('use');
    uso.setAttribute('href', esNoche ? '#i-sun' : '#i-moon');
    botonTema.setAttribute('aria-label', esNoche ? 'Activar tema claro' : 'Activar tema noche');
  }
  sincronizarTema();
  botonTema.addEventListener('click', function () {
    raiz.dataset.theme = raiz.dataset.theme === 'noche' ? 'claro' : 'noche';
    localStorage.setItem('guia-tema', raiz.dataset.theme);
    sincronizarTema();
  });

  /* ---------- Menú móvil ---------- */
  const nav = $('#nav');
  const menuBtn = $('#menu-btn');
  menuBtn.addEventListener('click', function () {
    const abierta = nav.classList.toggle('abierta');
    menuBtn.setAttribute('aria-expanded', String(abierta));
  });
  nav.addEventListener('click', function (evento) {
    if (evento.target.closest('a')) {
      nav.classList.remove('abierta');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', function (evento) {
    if (!evento.target.closest('.site-header')) {
      nav.classList.remove('abierta');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Textos del material compilado ---------- */
  $('[data-descripcion]').textContent = D.description;
  const fecha = new Date(D.compiledAt);
  if (!Number.isNaN(fecha.getTime())) {
    $('[data-compilado]').textContent = 'compilado el ' +
      fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ---------- Cifras ---------- */
  const estadisticas = [
    { numero: String(D.mecanismos.length), etiqueta: 'mecanismos' },
    { numero: String(D.entidades.length), etiqueta: 'entidades de referencia' },
    { numero: String(D.pasos.length), etiqueta: 'pasos de la ruta' },
    { numero: '147', etiqueta: 'Defensoría del Pueblo' }
  ];
  const stats = $('#stats');
  estadisticas.forEach(function (s) {
    const bloque = crear('div', 'stat');
    bloque.appendChild(crear('strong', '', s.numero));
    bloque.appendChild(crear('span', '', s.etiqueta));
    stats.appendChild(bloque);
  });

  /* ---------- Flujo de trabajo ---------- */
  const iconosPasos = ['i-search', 'i-scale', 'i-scale', 'i-route', 'i-file', 'i-up'];
  const contenedorPasos = $('#pasos');
  D.pasos.forEach(function (paso, indice) {
    const tarjeta = crear('article', 'paso');
    tarjeta.appendChild(crear('span', 'paso-num', String(indice + 1).padStart(2, '0')));
    const iconoCont = crear('span', 'paso-icon');
    iconoCont.appendChild(icono(iconosPasos[indice % iconosPasos.length]));
    tarjeta.appendChild(iconoCont);
    tarjeta.appendChild(crear('h3', '', paso.titulo));
    tarjeta.appendChild(crear('p', '', capitalizar(paso.texto)));
    contenedorPasos.appendChild(tarjeta);
  });

  /* ---------- Mecanismos con filtros ---------- */
  const iconosCategoria = {
    Inmediatos: 'i-shield',
    Administrativos: 'i-file',
    Colectivos: 'i-users',
    Especiales: 'i-chat',
    Otros: 'i-scale'
  };
  const ordenCategorias = ['Inmediatos', 'Administrativos', 'Colectivos', 'Especiales', 'Otros'];
  const presentes = ordenCategorias.filter(function (cat) {
    return D.mecanismos.some(function (m) { return m.categoria === cat; });
  });
  const categorias = ['Todos'].concat(presentes);
  const contenedorFiltros = $('#filtros');
  const gridMecanismos = $('#mecanismos-grid');

  function pintarMecanismos(categoria) {
    gridMecanismos.textContent = '';
    D.mecanismos.filter(function (m) {
      return categoria === 'Todos' || m.categoria === categoria;
    }).forEach(function (m) {
      const tarjeta = crear('article', 'mec-card');
      tarjeta.dataset.cat = m.categoria;
      const top = crear('div', 'mec-top');
      const iconoCont = crear('span', 'mec-icon');
      iconoCont.appendChild(icono(iconosCategoria[m.categoria] || 'i-scale'));
      top.appendChild(iconoCont);
      top.appendChild(crear('span', 'mec-cat', m.categoria));
      tarjeta.appendChild(top);
      tarjeta.appendChild(crear('h3', '', m.titulo));
      if (m.meta) tarjeta.appendChild(crear('p', 'mec-meta', m.meta));
      tarjeta.appendChild(crear('p', '', capitalizar(m.texto)));
      gridMecanismos.appendChild(tarjeta);
    });
  }

  categorias.forEach(function (cat, indice) {
    const boton = crear('button', 'filtro' + (indice === 0 ? ' activo' : ''), cat);
    boton.type = 'button';
    boton.addEventListener('click', function () {
      contenedorFiltros.querySelectorAll('.filtro').forEach(function (b) { b.classList.remove('activo'); });
      boton.classList.add('activo');
      pintarMecanismos(cat);
    });
    contenedorFiltros.appendChild(boton);
  });
  pintarMecanismos('Todos');

  /* ---------- Entidades ---------- */
  function iniciales(nombre) {
    return nombre
      .split(/[\s/,;]+/)
      .filter(function (p) { return p.length > 2; })
      .slice(0, 2)
      .map(function (p) { return p[0]; })
      .join('')
      .toUpperCase();
  }
  const contenedorEntidades = $('#entidades');
  D.entidades.forEach(function (entidad) {
    const tarjeta = crear('article', 'entidad');
    tarjeta.appendChild(crear('span', 'entidad-iniciales', iniciales(entidad.titulo)));
    const cuerpo = crear('div');
    cuerpo.appendChild(crear('h3', '', entidad.titulo));
    cuerpo.appendChild(crear('p', '', capitalizar(entidad.texto)));
    tarjeta.appendChild(cuerpo);
    contenedorEntidades.appendChild(tarjeta);
  });

  /* ---------- Límites (redacción orientada a la persona) ---------- */
  const traducciones = [
    [/^Deja claro que /, ''],
    [/^No inventes /, 'No se inventan '],
    [/^Advierte que /, ''],
    [/^Recomienda acudir a /, 'Se recomienda acudir a '],
    [/prioriza la atención urgente/, 'se prioriza la atención urgente']
  ];
  function textoLimite(texto) {
    if (texto.startsWith('Usa lenguaje probabilístico:')) {
      return 'El lenguaje es probabilístico («podría configurar», «según lo narrado», «es posible que») y nunca declara de forma definitiva que existió una vulneración.';
    }
    let salida = texto;
    traducciones.forEach(function (par) { salida = salida.replace(par[0], par[1]); });
    salida = salida.replace('no eres abogado', 'no soy abogado').replace('tu orientación', 'mi orientación');
    return capitalizar(salida);
  }
  const listaLimites = $('#limites-list');
  D.limites.forEach(function (limite) {
    const item = crear('li');
    item.appendChild(icono('i-check'));
    item.appendChild(crear('span', '', textoLimite(limite)));
    listaLimites.appendChild(item);
  });

  /* ---------- Orientador interactivo ---------- */
  const preguntas = [
    {
      id: 'situacion',
      titulo: '¿Qué está pasando?',
      texto: 'Elige la opción que más se acerque. Después podrás ajustar los hechos en el modelo.',
      opciones: [
        { id: 'peticion', etiqueta: 'No me responden una solicitud', detalle: 'Radicaste algo y no hay respuesta o está incompleta.' },
        { id: 'salud', etiqueta: 'Salud o servicio en riesgo', detalle: 'Hay una afectación a tu bienestar o a un servicio público.' },
        { id: 'libertad', etiqueta: 'Detención o amenaza', detalle: 'Tu libertad personal está en riesgo.' },
        { id: 'acto', etiqueta: 'Un acto administrativo me afecta', detalle: 'Una decisión oficial te perjudica.' },
        { id: 'otro', etiqueta: 'Otra situación', detalle: 'Necesitas precisar los hechos primero.' }
      ]
    },
    {
      id: 'urgencia',
      titulo: '¿Hay urgencia?',
      texto: 'Si existe riesgo inmediato, la atención urgente va primero y la ruta legal después.',
      opciones: [
        { id: 'urgente', etiqueta: 'Sí, hay riesgo inmediato', detalle: 'Violencia, amenaza, detención o emergencia de salud.' },
        { id: 'no-urgente', etiqueta: 'No, puedo esperar la respuesta', detalle: 'No hay una amenaza actual contra tu integridad.' }
      ]
    },
    {
      id: 'intento',
      titulo: '¿Qué has intentado?',
      texto: 'Esto ayuda a decidir si conviene insistir, presentar una queja o acudir al juez.',
      opciones: [
        { id: 'nada', etiqueta: 'Aún no he intentado nada', detalle: 'Quiero saber por dónde empezar.' },
        { id: 'peticion-yes', etiqueta: 'Ya presenté una petición', detalle: 'Tengo radicado, pero no hay respuesta suficiente.' },
        { id: 'queja-yes', etiqueta: 'Ya presenté una queja', detalle: 'Hubo respuesta o hubo incumplimiento.' }
      ]
    }
  ];

  const estado = {};
  let paso = 0;
  const cuerpoWizard = $('#wizard-body');
  const cajaResultado = $('#resultado');

  function renderPregunta() {
    cajaResultado.hidden = true;
    cuerpoWizard.style.display = '';
    const pregunta = preguntas[paso];
    const bloque = crear('div', 'pregunta');
    bloque.appendChild(crear('h3', '', pregunta.titulo));
    bloque.appendChild(crear('p', '', pregunta.texto));
    const opciones = crear('div', 'opciones');

    pregunta.opciones.forEach(function (opcion, indice) {
      const boton = crear('button', 'opcion');
      boton.type = 'button';
      boton.appendChild(crear('span', 'opcion-index', String(indice + 1).padStart(2, '0')));
      const texto = crear('span');
      texto.appendChild(crear('strong', '', opcion.etiqueta));
      texto.appendChild(crear('small', '', opcion.detalle));
      boton.appendChild(texto);
      boton.appendChild(icono('i-arrow'));
      boton.addEventListener('click', function () {
        estado[pregunta.id] = opcion.id;
        paso += 1;
        if (paso < preguntas.length) renderPregunta();
        else renderResultado();
      });
      opciones.appendChild(boton);
    });

    bloque.appendChild(opciones);
    reemplazar(cuerpoWizard, bloque);
    $('#paso-num').textContent = String(paso + 1);
    $('#barra-fill').style.width = ((paso + 1) / preguntas.length * 100) + '%';
  }

  const situacionTexto = {
    peticion: 'una solicitud presentada sin respuesta o con respuesta incompleta',
    salud: 'una posible afectación a la salud o a un servicio público',
    libertad: 'una detención o amenaza a la libertad personal',
    acto: 'un acto administrativo que te perjudica',
    otro: 'una situación que todavía necesita precisarse'
  };

  function recomendar() {
    const s = estado.situacion;
    const urgente = estado.urgencia === 'urgente';
    const intento = estado.intento;
    const base = { derecho: 'los derechos que podrían estar afectados según los hechos que narraste' };

    if (urgente && s === 'libertad') {
      return Object.assign({}, base, {
        titulo: 'Hábeas corpus y atención inmediata',
        texto: 'Según lo narrado, podría configurarse una afectación a la libertad personal. Ante una detención ilegal o una amenaza actual, la prioridad es la atención urgente; el hábeas corpus protege la libertad personal (Ley 1095 de 2006).',
        pasos: [
          'Llama al 123/112 o a la línea especializada si hay riesgo o detención en este momento.',
          'Reúne datos de la persona, la autoridad, el lugar y la hora; guarda cualquier orden o soporte.',
          'Presenta la acción ante el juez competente con la mayor brevedad posible.'
        ],
        entidades: ['Defensoría del Pueblo', 'Jueces de tutela y Corte Constitucional'],
        peticion: 'Solicito se verifique la legalidad de la detención o de la amenaza y se ordene lo que en derecho corresponda.'
      });
    }
    if (urgente) {
      return Object.assign({}, base, {
        titulo: 'Atención urgente + acción de tutela',
        texto: 'Según lo narrado, podría configurarse un perjuicio irremediable. La tutela busca la protección inmediata de derechos fundamentales cuando no existe otro medio de defensa o como mecanismo transitorio (Art. 86 CP; Decreto 2591 de 1991).',
        pasos: [
          'Atiende primero la emergencia: 123/112 o la línea especializada correspondiente.',
          'Reúne órdenes, negaciones, capturas y fechas que acrediten la urgencia.',
          'Presenta la tutela ante el juez competente; es gratuita y no requiere abogado.'
        ],
        entidades: ['Defensoría del Pueblo', 'Jueces de tutela y Corte Constitucional'],
        peticion: 'Solicito la protección inmediata del derecho fundamental afectado y las medidas necesarias para evitar el perjuicio.'
      });
    }
    if (s === 'libertad') {
      return Object.assign({}, base, {
        titulo: 'Hábeas corpus',
        texto: 'Según lo narrado, podría configurarse una afectación a la libertad personal. El hábeas corpus es la acción prevista para protegerla ante detención ilegal o amenaza de ella (Ley 1095 de 2006).',
        pasos: [
          'Confirma si hay una orden judicial y guarda copia de todo lo recibido.',
          'Anota autoridad, lugar, fecha y hora, y los datos de la persona afectada.',
          'Presenta la acción ante el juez competente y pide la verificación inmediata.'
        ],
        entidades: ['Defensoría del Pueblo', 'Jueces de tutela y Corte Constitucional'],
        peticion: 'Solicito se examine la legalidad de la detención o amenaza y se proteja la libertad personal.'
      });
    }
    if (s === 'salud') {
      return Object.assign({}, base, {
        titulo: 'Tutela + ruta sectorial en salud',
        texto: 'Según lo narrado, podrían estar afectados derechos fundamentales relacionados con la salud y el acceso al servicio. Conviene combinar la ruta administrativa con la tutela si hay riesgo o demora injustificada.',
        pasos: [
          'Reúne órdenes médicas, formularios, negaciones o registro de demoras.',
          'Presenta queja o reclamo ante la entidad y, si corresponde, ante la Superintendencia de Salud.',
          'Si hay riesgo o incumplimiento, presenta tutela ante el juez competente.'
        ],
        entidades: ['Superintendencias', 'Defensoría del Pueblo'],
        peticion: 'Solicito la autorización, entrega o prestación del servicio requerido y la corrección de la demora o negativa.'
      });
    }
    if (s === 'acto') {
      return Object.assign({}, base, {
        titulo: 'Recursos administrativos o acción de cumplimiento',
        texto: 'Según lo narrado, el camino podría empezar por los recursos contra el acto administrativo (reposición y apelación, CPACA). Si hay renuencia a cumplir una norma o acto, podría evaluarse la acción de cumplimiento (Art. 87 CP; Ley 393 de 1997).',
        pasos: [
          'Consulta el acto, la fecha de notificación y el plazo para recurrirlo.',
          'Presenta reposición y, si procede, apelación dentro del término.',
          'Si persiste la renuencia, evalúa la acción de cumplimiento o la queja ante el órgano de control.'
        ],
        entidades: ['Procuraduría General de la Nación', 'Personería Municipal/Distrital'],
        peticion: 'Solicito la revocación o modificación del acto, o el cumplimiento de la norma o decisión aplicable.'
      });
    }
    if (s === 'peticion' && intento !== 'nada') {
      return Object.assign({}, base, {
        titulo: 'Queja o reclamación (y tutela si no hay respuesta)',
        texto: 'Según lo narrado, ya hay una solicitud y una respuesta o silencio. Podría configurarse una respuesta incompleta; la ruta suele empezar por la queja interna y escalar según la entidad.',
        pasos: [
          'Reúne el radicado, la fecha y la respuesta recibida (o el registro del silencio).',
          'Presenta queja ante la misma entidad y, según el caso, ante la Personería o la Defensoría.',
          'Si no hay respuesta útil, evalúa la acción de tutela por el derecho de petición.'
        ],
        entidades: ['Personería Municipal/Distrital', 'Defensoría del Pueblo'],
        peticion: 'Solicito una respuesta de fondo, clara y completa frente a la solicitud radicada.'
      });
    }
    return Object.assign({}, base, {
      titulo: 'Derecho de petición',
      texto: 'Según lo narrado, conviene empezar por el derecho de petición para dejar constancia escrita de los hechos y pedir una respuesta concreta (Art. 23 CP; Ley 1755 de 2015). Los plazos son orientativos y pueden variar.',
      pasos: [
        'Precisa qué ocurrió, cuándo, dónde, quién intervino y qué pruebas tienes.',
        'Presenta la petición por escrito ante la entidad competente y guarda el comprobante.',
        'Ante silencio o respuesta incompleta: queja, Personería/Procuraduría o tutela.'
      ],
      entidades: ['Defensoría del Pueblo', 'Personería Municipal/Distrital'],
      peticion: 'Solicito se revise el caso y se me dé respuesta escrita sobre lo aquí planteado.'
    });
  }

  function modeloPara(resultado) {
    return [
      'Señor(a): [nombre de la entidad o juez competente]',
      'Asunto: ' + resultado.titulo + ' — ' + (situacionTexto[estado.situacion] || 'situación por precisar'),
      '',
      'Yo, [nombre completo], identificado(a) con [documento], solicito respetuosamente:',
      '',
      'HECHOS',
      'Narrar qué ocurrió, cuándo, dónde, quién intervino y qué se ha intentado hasta ahora.',
      'Situación señalada: ' + (situacionTexto[estado.situacion] || 'por precisar') + '.',
      'Intento previo: ' + (estado.intento === 'nada' ? 'ninguno' : estado.intento === 'peticion-yes' ? 'petición radicada' : 'queja radicada') + '.',
      '',
      'DERECHOS QUE PODRÍAN ESTAR AFECTADOS',
      capitalizar(resultado.derecho) + '.',
      '',
      'PETICIÓN O PRETENSIÓN',
      capitalizar(resultado.peticion),
      '',
      'ANEXOS',
      '[Copias, capturas, radicados, órdenes y cualquier otra prueba disponible.]',
      '',
      'Firma: ______________________________    Fecha: ______________'
    ].join('\n');
  }

  function mostrarToast(mensaje) {
    const toast = $('#toast');
    toast.textContent = mensaje;
    toast.classList.add('mostrar');
    window.setTimeout(function () { toast.classList.remove('mostrar'); }, 2200);
  }

  function renderResultado() {
    cuerpoWizard.style.display = 'none';
    cajaResultado.hidden = false;
    $('#paso-num').textContent = '3';
    $('#barra-fill').style.width = '100%';

    const resultado = recomendar();
    const bloque = crear('div');
    const head = crear('div', 'resultado-head');
    head.appendChild(crear('span', 'chip', 'Sugerencia orientativa'));
    bloque.appendChild(head);
    bloque.appendChild(crear('h3', '', resultado.titulo));
    bloque.appendChild(crear('p', '', resultado.texto));

    const pasos = crear('ol', 'resultado-steps');
    resultado.pasos.forEach(function (texto) {
      const li = crear('li');
      li.appendChild(icono('i-check'));
      li.appendChild(crear('span', '', texto));
      pasos.appendChild(li);
    });
    bloque.appendChild(pasos);

    const chips = crear('div', 'resultado-chips');
    resultado.entidades.forEach(function (nombre) { chips.appendChild(crear('span', '', nombre)); });
    bloque.appendChild(chips);

    const modelo = crear('div', 'modelo');
    const cabeza = crear('div', 'modelo-head');
    cabeza.appendChild(crear('h4', '', 'Modelo listo para ajustar'));
    modelo.appendChild(cabeza);
    const area = crear('textarea');
    area.value = modeloPara(resultado);
    area.setAttribute('aria-label', 'Modelo de solicitud');
    area.rows = 12;
    modelo.appendChild(area);

    const acciones = crear('div', 'modelo-acciones');
    const copiar = crear('button', 'btn btn-small', 'Copiar modelo');
    copiar.type = 'button';
    copiar.appendChild(icono('i-copy'));
    copiar.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(area.value)
          .then(function () { mostrarToast('Modelo copiado'); })
          .catch(function () { copiarFallback(area); });
      } else {
        copiarFallback(area);
      }
    });
    const reiniciar = crear('button', 'btn btn-small secundario', 'Empezar de nuevo');
    reiniciar.type = 'button';
    reiniciar.addEventListener('click', function () {
      Object.keys(estado).forEach(function (clave) { delete estado[clave]; });
      paso = 0;
      renderPregunta();
    });
    acciones.append(copiar, reiniciar);
    modelo.appendChild(acciones);
    bloque.appendChild(modelo);

    bloque.appendChild(crear('p', 'aviso',
      'Recordatorio: esta información es orientativa y no reemplaza la asesoría de un abogado de confianza ni de la Defensoría del Pueblo (línea 147). Verifica plazos y requisitos en fuentes oficiales.'));

    reemplazar(cajaResultado, bloque);
  }

  function copiarFallback(area) {
    area.select();
    try {
      document.execCommand('copy');
      mostrarToast('Modelo copiado');
    } catch (error) {
      mostrarToast('Selecciona y copia el modelo manualmente');
    }
  }

  renderPregunta();

  /* ---------- Animación de entrada ---------- */
  const elementos = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach(function (elemento) { observador.observe(elemento); });
  } else {
    elementos.forEach(function (elemento) { elemento.classList.add('visible'); });
  }
})();
