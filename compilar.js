// Compila el agente OpenCode `guia-derechos-co.md` en artefactos listos para usar.
// Uso: node compilar.js [archivo-agente.md]
const fs = require('fs');
const path = require('path');

const entrada = process.argv[2] || 'guia-derechos-co.md';
const rutaEntrada = path.resolve(__dirname, entrada);
const nombre = path.basename(entrada, path.extname(entrada));

if (!fs.existsSync(rutaEntrada)) {
  console.error(`No existe el archivo: ${rutaEntrada}`);
  process.exit(1);
}

const texto = fs.readFileSync(rutaEntrada, 'utf8');
const lineas = texto.split(/\r?\n/);

if (lineas[0].trim() !== '---') {
  console.error('El archivo no empieza con frontmatter YAML (---).');
  process.exit(1);
}

const finFrontmatter = lineas.indexOf('---', 1);
if (finFrontmatter === -1) {
  console.error('No se encontró el cierre del frontmatter YAML (---).');
  process.exit(1);
}

const yaml = lineas.slice(1, finFrontmatter).join('\n');
const instrucciones = lineas.slice(finFrontmatter + 1).join('\n').trim();

function valorClave(clave) {
  const m = yaml.match(new RegExp(`^${clave}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

function leerPermisos() {
  const bloque = yaml.match(/permissions:\s*\n([\s\S]*?)(?=\n\S|$)/);
  if (!bloque) return [];
  const re = /-\s*action:\s*(\S+)\s*\n\s*resource:\s*(.*?)\s*\n\s*effect:\s*(\S+)/g;
  const permisos = [];
  let m;
  while ((m = re.exec(bloque[1])) !== null) {
    permisos.push({ action: m[1], resource: m[2].replace(/^["']|["']$/g, ''), effect: m[3] });
  }
  return permisos;
}

const agente = {
  name: nombre,
  description: valorClave('description'),
  mode: valorClave('mode') || 'all',
  color: valorClave('color'),
  permissions: leerPermisos(),
  instructions: instrucciones,
};

// Validación mínima de integridad.
const errores = [];
if (!agente.description) errores.push('falta `description`');
if (!['all', 'primary', 'subagent'].includes(agente.mode)) errores.push(`modo no reconocido: ${agente.mode}`);
if (agente.color && !/^#[0-9a-fA-F]{6}$/.test(agente.color)) errores.push(`color no válido: ${agente.color}`);
if (!agente.instructions) errores.push('el cuerpo de instrucciones está vacío');
for (const p of agente.permissions) {
  if (!['allow', 'deny'].includes(p.effect)) errores.push(`effect no válido en permiso: ${p.effect}`);
}
if (errores.length) {
  console.error('Validación fallida:\n- ' + errores.join('\n- '));
  process.exit(1);
}

const compilado = {
  ...agente,
  compiledAt: new Date().toISOString(),
  source: path.basename(rutaEntrada),
};

const rutaJson = path.join(__dirname, `${nombre}.compilado.json`);
const rutaMd = path.join(__dirname, `${nombre}.compilado.md`);

fs.writeFileSync(rutaJson, JSON.stringify(compilado, null, 2) + '\n', 'utf8');

const permisosTxt = agente.permissions.length
  ? agente.permissions.map(p => `- ${p.action}: ${p.resource} → ${p.effect}`).join('\n')
  : '- (ninguno)';

const md = `# ${agente.name} — versión compilada

> Generado automáticamente desde \`${path.basename(rutaEntrada)}\`. No editar a mano.

## Configuración

- Nombre: ${agente.name}
- Modo: ${agente.mode}
- Color: ${agente.color || '(sin definir)'}
- Permisos:
${permisosTxt}

## Descripción

${agente.description}

## Instrucciones

${agente.instructions}
`;

fs.writeFileSync(rutaMd, md, 'utf8');

console.log('Compilación correcta.');
console.log(`  JSON: ${rutaJson}`);
console.log(`  MD:   ${rutaMd}`);
console.log(`  Permisos: ${agente.permissions.length} | Instrucciones: ${agente.instructions.length} caracteres`);
