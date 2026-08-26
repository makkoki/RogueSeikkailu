"use strict";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const tile = 32;
const width = 21;
const height = 15;

const maps = [
  [
    "#####################", "#.....#####.........#", "#.....#####.........#",
    "#...............!...#", "#.....#####.........#", "###.#######.####.####",
    "###.#######.####.####", "#.........#.........#", "#.........#.........#",
    "#....S..............#", "#.........#....L....#", "#####.#####.........#",
    "#<..............>...#", "#...................#", "#####################"
  ],
  [
    "#####################", "#<....#####.........#", "#.....#####....!...V#",
    "#...............#####", "#.....#####.....#####", "###.#######.#########",
    "###.#######.#########", "#.........#.........#", "#.........#.........#",
    "#....L..............#", "#.........#....S....#", "#####.#####.........#",
    "#...............★...#", "#...................#", "#####################"
  ]
];

let state;

function newGame() {
  state = {
    depth: 0, player: { x: 1, y: 12, hp: 8, maxHp: 8, power: 1 },
    enemies: maps.map((map) => findSymbols(map, "SLV").map(({ x, y, char }) => ({ x, y, name: char, hp: char === "V" ? 3 : 2 }))),
    collected: new Set(), over: false, message: "Löydä tie syvimmän luolan aarteelle!"
  };
  update();
}

function findSymbols(map, symbols) {
  const found = [];
  map.forEach((row, y) => [...row].forEach((char, x) => { if (symbols.includes(char)) found.push({ x, y, char }); }));
  return found;
}

function cell(x, y) { return maps[state.depth][y]?.[x] ?? "#"; }
function enemyAt(x, y) { return state.enemies[state.depth].find((enemy) => enemy.x === x && enemy.y === y); }
function itemKey(x, y) { return `${state.depth}:${x}:${y}`; }

function move(dx, dy) {
  if (state.over) return;
  const nx = state.player.x + dx;
  const ny = state.player.y + dy;
  if (cell(nx, ny) === "#") { state.message = "Kiviseinä tukkii tien."; return update(); }
  const enemy = enemyAt(nx, ny);
  if (enemy) {
    enemy.hp -= state.player.power;
    state.message = `Osuit viholliseen ${enemy.name}!`;
    if (enemy.hp <= 0) {
      state.enemies[state.depth] = state.enemies[state.depth].filter((target) => target !== enemy);
      state.message = `Voitit vihollisen ${enemy.name}.`;
    }
  } else {
    state.player.x = nx; state.player.y = ny;
    inspectCell();
  }
  enemyTurn();
  update();
}

function inspectCell() {
  const here = cell(state.player.x, state.player.y);
  const key = itemKey(state.player.x, state.player.y);
  if (here === "!" && !state.collected.has(key)) {
    state.collected.add(key); state.player.power += 1; state.player.maxHp += 2; state.player.hp = state.player.maxHp;
    state.message = "Löysit taikavarusteen! Voimasi ja kuntosi kasvoivat.";
  } else if (here === ">" && state.depth === 0) {
    state.depth = 1; state.player.x = 1; state.player.y = 1; state.message = "Laskeuduit syvempään luolaan.";
  } else if (here === "<" && state.depth === 1) {
    state.depth = 0; state.player.x = 1; state.player.y = 12; state.message = "Palasit ylempään luolaan.";
  } else if (here === "★") {
    state.over = true; state.message = "Löysit Valotähden! Seikkailu onnistui! ✨";
  }
}

function enemyTurn() {
  for (const enemy of state.enemies[state.depth]) {
    const distance = Math.abs(enemy.x - state.player.x) + Math.abs(enemy.y - state.player.y);
    if (distance === 1) state.player.hp -= 1;
  }
  if (state.player.hp <= 0) { state.player.hp = 0; state.over = true; state.message = "Voimasi loppuivat. Kokeile rohkeasti uudelleen!"; }
}

function draw() {
  ctx.fillStyle = "#080d17"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const map = maps[state.depth];
  map.forEach((row, y) => [...row].forEach((char, x) => {
    const px = x * tile, py = y * tile;
    ctx.fillStyle = char === "#" ? "#28344b" : (x + y) % 2 ? "#111a2b" : "#141f33";
    ctx.fillRect(px, py, tile, tile);
    if ("<>!★".includes(char) && !state.collected.has(itemKey(x, y))) drawGlyph(char, x, y, char === "★" ? "#fbbf24" : char === "!" ? "#a7f3d0" : "#c4b5fd");
  }));
  state.enemies[state.depth].forEach((enemy) => drawGlyph(enemy.name, enemy.x, enemy.y, "#fb7185"));
  drawGlyph("@", state.player.x, state.player.y, "#67e8f9");
  if (state.over) {
    ctx.fillStyle = "#050812d9"; ctx.fillRect(0, 190, canvas.width, 100);
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px ui-monospace, monospace"; ctx.textAlign = "center";
    ctx.fillText(state.player.hp > 0 ? "SEIKKAILU ONNISTUI!" : "YRITÄ UUDELLEEN", canvas.width / 2, 250);
  }
}

function drawGlyph(glyph, x, y, color) {
  ctx.fillStyle = color; ctx.font = "bold 22px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(glyph, x * tile + tile / 2, y * tile + tile / 2 + 1);
}

function update() {
  draw();
  document.querySelector("#depth").textContent = `${state.depth + 1} / 2`;
  document.querySelector("#power").textContent = state.player.power;
  document.querySelector("#hp").textContent = `${state.player.hp} / ${state.player.maxHp}`;
  document.querySelector("#message").textContent = state.message;
}

const directions = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
window.addEventListener("keydown", (event) => { const direction = directions[event.key]; if (direction) { event.preventDefault(); move(...direction); } });
document.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => move(...button.dataset.move.split(",").map(Number))));
document.querySelector("#restart").addEventListener("click", newGame);
newGame();
