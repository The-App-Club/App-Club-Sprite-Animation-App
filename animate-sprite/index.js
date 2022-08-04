function niceRolling({ speed, width, height, spriteImageURL }) {
  let count = 0;
  let moveX = 0;

  function marquee({ speed, width, height, spriteImageURL }) {
    function mod(n, m) {
      return ((n % m) + m) % m;
    }
    let a = new Date();
    moveX++;
    reqId = requestAnimationFrame(() => {
      marquee({ speed, width, height, spriteImageURL });
    });
    if (mod(moveX, 101 - speed) + 1 === 101 - speed) {
      const grp = mod(count, 36);
      const previewDom = document.querySelector(`.preview`);
      previewDom.style.width = `${width}px`;
      previewDom.style.height = `${height}px`;
      previewDom.style.backgroundImage = `url(${spriteImageURL})`;
      previewDom.style.backgroundPosition = `-0px -${grp * height}px`;
      count = count + 1;
    }
  }
  marquee({ speed, width, height, spriteImageURL });
}

let reqId;
let speed = 50;
const inputSpeedNumberDom = document.querySelector(`input.number`);
inputSpeedNumberDom.addEventListener("change", (event) => {
  speed = Number(event.target.value);
  if (reqId) {
    cancelAnimationFrame(reqId)
  }
  niceRolling({
    speed: speed,
    width: 32,
    height: 64,
    spriteImageURL: `./images/sprite.png`,
  });
});

niceRolling({
  speed: speed,
  width: 32,
  height: 64,
  spriteImageURL: `./images/sprite.png`,
});
