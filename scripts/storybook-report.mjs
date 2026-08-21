#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const HEADER = [
  'position',
  'flow',
  'story_id',
  'label',
  'relative_png_path',
  'byte_size',
];

function fail(message) {
  console.error(`storybook-report: ${message}`);
  process.exitCode = 1;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function caveatFor(row) {
  const searchable = `${row.flow} ${row.story_id} ${row.label}`.toLowerCase();
  if (/(camera|add[ _-]?photo)/.test(searchable)) {
    return 'Hardware caveat: the emulator camera preview is not meaningful visual evidence.';
  }
  if (/(^|[ _-])(map|home)([ _-]|$)|map[ _-]?on[ _-]?your[ _-]?own/.test(searchable)) {
    return 'Hardware caveat: map tiles and GPS readouts are outside visual verification; map chrome is in scope.';
  }
  return '';
}

function parseRow(line, lineNumber) {
  const columns = line.split('\t');
  if (columns.length !== HEADER.length) {
    throw new Error(`captures.tsv line ${lineNumber} must contain exactly six tab-separated columns`);
  }
  const [position, flow, storyId, label, relativePngPath, byteSize] = columns;
  if (!/^\d{3,}$/.test(position)) {
    throw new Error(`captures.tsv line ${lineNumber} has an invalid position: ${position}`);
  }
  if (!flow || !/^[a-z0-9-]+$/.test(flow)) {
    throw new Error(`captures.tsv line ${lineNumber} has an invalid flow: ${flow}`);
  }
  if (!storyId) {
    throw new Error(`captures.tsv line ${lineNumber} has an empty story id`);
  }
  if (!relativePngPath || relativePngPath.includes('\\') || path.posix.isAbsolute(relativePngPath) || path.win32.isAbsolute(relativePngPath)) {
    throw new Error(`captures.tsv line ${lineNumber} has an unsafe PNG path: ${relativePngPath}`);
  }
  const normalized = path.posix.normalize(relativePngPath);
  if (normalized !== relativePngPath || normalized === '.' || normalized.startsWith('../') || normalized.includes('/../')) {
    throw new Error(`captures.tsv line ${lineNumber} has a path traversal: ${relativePngPath}`);
  }
  if (!normalized.toLowerCase().endsWith('.png')) {
    throw new Error(`captures.tsv line ${lineNumber} PNG path must end in .png: ${relativePngPath}`);
  }
  if (!/^\d+$/.test(byteSize)) {
    throw new Error(`captures.tsv line ${lineNumber} has an invalid byte size: ${byteSize}`);
  }
  return { position, flow, storyId, label, relativePngPath, byteSize };
}

async function validateLedger(outputDirectory) {
  const ledgerPath = path.join(outputDirectory, 'captures.tsv');
  const content = await fs.readFile(ledgerPath, 'utf8');
  const lines = content.split('\n');
  if (lines.at(-1) === '') lines.pop();
  if (lines.length === 0 || lines[0].split('\t').join('\t') !== HEADER.join('\t')) {
    throw new Error('captures.tsv has an invalid header');
  }
  const rows = [];
  const positions = new Set();
  const storyIds = new Set();
  const pngPaths = new Set();
  const outputRealPath = await fs.realpath(outputDirectory);
  for (let index = 1; index < lines.length; index += 1) {
    if (!lines[index]) throw new Error(`captures.tsv line ${index + 1} is empty`);
    const row = parseRow(lines[index], index + 1);
    if (positions.has(row.position)) throw new Error(`duplicate position: ${row.position}`);
    if (storyIds.has(row.storyId)) throw new Error(`duplicate story id: ${row.storyId}`);
    if (pngPaths.has(row.relativePngPath)) throw new Error(`duplicate PNG path: ${row.relativePngPath}`);
    positions.add(row.position);
    storyIds.add(row.storyId);
    pngPaths.add(row.relativePngPath);
    const pngPath = path.resolve(outputDirectory, ...row.relativePngPath.replaceAll('\\', '/').split('/'));
    if (pngPath !== outputDirectory && !pngPath.startsWith(`${outputDirectory}${path.sep}`)) {
      throw new Error(`PNG path escapes output directory: ${row.relativePngPath}`);
    }
    let stat;
    try {
      stat = await fs.stat(pngPath);
    } catch {
      throw new Error(`missing PNG for ${row.storyId}: ${row.relativePngPath}`);
    }
    if (!stat.isFile()) throw new Error(`PNG is not a regular file: ${row.relativePngPath}`);
    if (stat.size !== Number(row.byteSize)) {
      throw new Error(`byte size mismatch for ${row.relativePngPath}: ledger says ${row.byteSize}, file is ${stat.size}`);
    }
    const realPngPath = await fs.realpath(pngPath);
    if (realPngPath !== outputRealPath && !realPngPath.startsWith(`${outputRealPath}${path.sep}`)) {
      throw new Error(`PNG path escapes output directory: ${row.relativePngPath}`);
    }
    rows.push(row);
  }
  return rows;
}

function renderFlow(flow, rows) {
  const cards = rows.map((row) => {
    const caveat = caveatFor(row);
    return `      <article class="frame">\n        <img src="../${escapeHtml(row.relativePngPath)}" alt="${escapeHtml(`${row.position} ${row.label}`)}" loading="lazy">\n        <div class="caption"><span class="ordinal">${escapeHtml(row.position)}</span> <strong>${escapeHtml(row.label)}</strong><br><code>${escapeHtml(row.storyId)}</code>${caveat ? `<p class="caveat">${escapeHtml(caveat)}</p>` : ''}</div>\n      </article>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(flow)} Storybook filmstrip</title>
    <style>
      :root { color-scheme: dark; font-family: system-ui, sans-serif; background: #171717; color: #f5f5f5; }
      body { margin: 0 auto; max-width: 720px; padding: 1rem; }
      h1 { font-size: 1.35rem; }
      .filmstrip { display: grid; gap: 1.5rem; }
      .frame { margin: 0; }
      img { display: block; width: 100%; height: auto; border-radius: .5rem; background: #292929; }
      .caption { padding: .65rem 0; line-height: 1.5; }
      .ordinal { color: #a3e635; font-variant-numeric: tabular-nums; }
      code { color: #c4b5fd; overflow-wrap: anywhere; }
      .caveat { color: #fbbf24; margin: .4rem 0 0; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(flow)} Storybook filmstrip</h1>
    <main class="filmstrip">
${cards}
    </main>
  </body>
</html>
`;
}

async function assertSafeFlowDirectory(flowDirectory, outputRealPath) {
  let directoryStat;
  try {
    directoryStat = await fs.lstat(flowDirectory);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (directoryStat?.isSymbolicLink()) {
    throw new Error(`flow report directory is a symlink: ${flowDirectory}`);
  }
  if (directoryStat && !directoryStat.isDirectory()) {
    throw new Error(`flow report path is not a directory: ${flowDirectory}`);
  }
  await fs.mkdir(flowDirectory, { recursive: true });
  const flowRealPath = await fs.realpath(flowDirectory);
  if (flowRealPath !== outputRealPath && !flowRealPath.startsWith(`${outputRealPath}${path.sep}`)) {
    throw new Error(`flow report directory escapes output directory: ${flowDirectory}`);
  }
  return flowRealPath;
}

async function assertSafeReportFile(reportPath, flowRealPath) {
  let reportStat;
  try {
    reportStat = await fs.lstat(reportPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (reportStat?.isSymbolicLink()) {
    throw new Error(`flow report file is a symlink: ${reportPath}`);
  }
  if (reportStat && !reportStat.isFile()) {
    throw new Error(`flow report path is not a regular file: ${reportPath}`);
  }
  if (reportStat) {
    const reportRealPath = await fs.realpath(reportPath);
    if (reportRealPath !== flowRealPath && !reportRealPath.startsWith(`${flowRealPath}${path.sep}`)) {
      throw new Error(`flow report file escapes flow directory: ${reportPath}`);
    }
  }
}

async function main() {
  if (process.argv.length !== 3) throw new Error('usage: node scripts/storybook-report.mjs <capture-output-directory>');
  const outputDirectory = path.resolve(process.argv[2]);
  const stat = await fs.stat(outputDirectory);
  if (!stat.isDirectory()) throw new Error(`capture output is not a directory: ${outputDirectory}`);
  const rows = await validateLedger(outputDirectory);
  const outputRealPath = await fs.realpath(outputDirectory);
  const flows = new Map();
  for (const row of rows) {
    if (!flows.has(row.flow)) flows.set(row.flow, []);
    flows.get(row.flow).push(row);
  }
  for (const [flow, flowRows] of flows) {
    const flowDirectory = path.join(outputDirectory, flow);
    const flowRealPath = await assertSafeFlowDirectory(flowDirectory, outputRealPath);
    const reportPath = path.join(flowDirectory, 'index.html');
    await assertSafeReportFile(reportPath, flowRealPath);
    await fs.writeFile(reportPath, renderFlow(flow, flowRows), 'utf8');
  }
  console.log(`storybook-report: wrote ${flows.size} flow report(s) in ${outputDirectory}`);
}

main().catch((error) => fail(error.message));
