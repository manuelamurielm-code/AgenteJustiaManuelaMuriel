// Genera `datos.js` a partir del agente compilado (`guia-derechos-co.compilado.json`).
// Así la landing page siempre refleja el material compilado, no texto copiado a mano.
const fs = require('fs');
const path = require('path');

const origen = path.join(__dirname, 'guia-derechos-co.compilado.json');
const destino = path.join(__dirname, 'datos.js');

if (!fs.existsSync(origen)) {
  console.error('No existe guia-derechos-co.compilado.json. Ejecuta primero: node compilar.js');
  process.exit(1);
}

const compilado = JSON.parse(fs.readFileSync(origen, 'utf8'));
const lineas = compilado.instructions.split(/\r?\n/);
const secciones = {};
let actual = null;

for (const linea of lineas) {
  const titulo = linea.match(/^##\s+(.+)$/);
  if (titulo) {
    actual = titulo[1].trim();
    secciones[actual] = [];
    continue;
  }
  if (actual && linea.trim()) secciones[actual].push(linea.trim());
}

const limpiar = (texto) => texto.replace(/\*\*/g, '').replace(/`/g, '');

function numerados(clave) {
  return (secciones[clave] || [])
    .filter((l) => /^\d+\.\s/.test(l))
    .map((l) => limpiar(l.replace(/^\d+\.\s*/, '')));
}

function pasarPaso(texto) {
  const limpio = limpiar(texto);
  const Corte = limpio.indexOf(':');
  if (Corte > 0 && Corte < 45) {
    return { titulo: limpio.slice(0, Corte).trim(), texto: limpio.slice(Corte + 1).trim() };
  }
  return { titulo: limpio.slice(0, 28).trim(), texto: limpio.trim() };
}

function pasarItem(texto) {
  const limpio = limpiar(texto);
  const corte = limpio.indexOf(':');
  const separar = corte > 0 && corte < 140;
  const todo = separar ? limpio.slice(0, corte).trim() : limpio;
  const resto = separar ? limpio.slice(corte + 1).trim() : '';
  const m = todo.match(/^(.+?)\s*\(([^)]*)\)$/);
  return {
    titulo: m ? m[1].trim() : todo,
    meta: m ? m[2].trim() : '',
    texto: resto,
  };
}

function categoria(titulo) {
  const t = titulo.toLowerCase();
  if (/tutela|hábeas|desacato/.test(t)) return 'Inmediatos';
  if (/petición|cumplimiento|queja|recursos/.test(t)) return 'Administrativos';
  if (/popular|grupo/.test(t)) return 'Colectivos';
  if (/protecciones/.test(t)) return 'Especiales';
  return 'Otros';
}

const proposito = numerados('Propósito');
const limites = (secciones['Alcance y límites (obligatorio)'] || [])
  .filter((l) => l.startsWith('- '))
  .map((l) => limpiar(l.replace(/^-\s*/, '')));
const pasos = numerados('Flujo de trabajo').map(pasarPaso);
const mecanismos = (secciones['Mecanismos que debes saber explicar (orientativo, verificar vigencia)'] || [])
  .filter((l) => l.startsWith('- **'))
  .map((l) => {
    const item = pasarItem(l.replace(/^-\s*/, ''));
    return { ...item, categoria: categoria(item.titulo) };
  });
const entidades = (secciones['Entidades de referencia rápida (verificar siempre)'] || [])
  .filter((l) => l.startsWith('- **'))
  .map((l) => pasarItem(l.replace(/^-\s*/, '')));
const estilo = (secciones['Estilo de respuesta'] || [])
  .filter((l) => l.startsWith('- '))
  .map((l) => limpiar(l.replace(/^-\s*/, '')));

const datos = {
  name: compilado.name,
  description: compilado.description,
  mode: compilado.mode,
  color: compilado.color,
  compiledAt: compilado.compiledAt,
  source: compilado.source,
  proposito,
  limites,
  pasos,
  mecanismos,
  entidades,
  estilo,
};

fs.writeFileSync(
  destino,
  '/* Generado por generar-datos.js a partir del agente compilado. No editar a mano. */\n' +
    'window.GUIA_DATOS = ' + JSON.stringify(datos, null, 2) + ';\n',
  'utf8'
);

console.log('Datos generados:');
console.log(`  Pasos: ${pasos.length} | Mecanismos: ${mecanismos.length} | Entidades: ${entidades.length} | Límites: ${limites.length}`);
console.log(`  Archivo: ${destino}`);
