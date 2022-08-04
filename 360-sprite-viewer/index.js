let currentPoinst = 0;
let count = 16;
let objectWidth = 1200;
let objectHeight = 560;
let ratio = 0.5;
let spriteImageURL = "./images/alfa.png";
const rotateDom = document.querySelector(`.rotate`);
rotateDom.style.width = `${objectWidth}px`;
rotateDom.style.height = `${objectHeight}px`;
rotateDom.style.backgroundImage = `url(${spriteImageURL})`;

function mod(n, m) {
  return ((n % m) + m) % m;
}

const inputRangeDom = document.querySelector(`input.range`);
inputRangeDom.addEventListener("change", (event) => {
  currentPoinst = Number(event.target.value);
  const grp = mod(currentPoinst, count);
  rotateDom.style.backgroundPosition = `-${grp * objectWidth}px -0px `;
});

inputRangeDom.addEventListener("mousemove", (event) => {
  currentPoinst = Number(event.target.value);
  const grp = mod(currentPoinst, count);
  rotateDom.style.backgroundPosition = `-${grp * objectWidth}px -0px `;
});
