import html2canvas from 'html2canvas';

function loadImageDom(publicURL) {
  return new Promise((resolve, reject) => {
    const imageDom = new Image();
    imageDom.crossOrigin = 'anonymous';
    imageDom.onload = (event) => {
      resolve({
        imageDom: imageDom,
        imageDomWidth: imageDom.width,
        imageDomHeight: imageDom.height,
      });
    };
    imageDom.onerror = (event) => {
      reject(event);
    };
    imageDom.src = publicURL;
  });
}

function getOrientation(imageDomWidth, imageDomHeight) {
  if (imageDomWidth > imageDomHeight) {
    return `landscape`;
  }
  return `portrait`;
}

function reflectImage2Canvas(imageDom, imageDomWidth, imageDomHeight, previewAreaDomWidth, previewAreaDomHeight) {
  return new Promise((resolve) => {
    const canvasDom = document.createElement(`canvas`);
    const canvasDomContext = canvasDom.getContext('2d');
    const adjustedRatio = 1;
    const ratio =
      adjustedRatio *
      (getOrientation(imageDomWidth, imageDomHeight) === `landscape` ? previewAreaDomWidth / imageDomWidth : previewAreaDomHeight / imageDomHeight);

    canvasDom.width = previewAreaDomWidth;
    canvasDom.height = previewAreaDomHeight;

    const resizedImageDomWidth = imageDomWidth * ratio;
    const resizedImageDomHeight = imageDomHeight * ratio;

    const resizedImageDomCenterX = resizedImageDomWidth / 2;
    const resizedImageDomCenterY = resizedImageDomHeight / 2;
    const previewAreaDomCenterX = previewAreaDomWidth / 2;
    const previewAreaDomCenterY = previewAreaDomHeight / 2;

    const deltaParallelMoveX = previewAreaDomCenterX - resizedImageDomCenterX;
    const deltaParallelMoveY = previewAreaDomCenterY - resizedImageDomCenterY;

    canvasDomContext.drawImage(imageDom, deltaParallelMoveX, deltaParallelMoveY, imageDomWidth * ratio, imageDomHeight * ratio);

    resolve(canvasDom);
  });
}

function getDataURL(canvasDom) {
  return new Promise((resolve) => {
    const dataURL = canvasDom.toDataURL('image/webp', 1.0);
    resolve(dataURL);
  });
}

function spliter(contentDom, dataURL, itemDomWidth, itemDomHeight) {
  return new Promise(async (resolve) => {
    const {imageDom, imageDomWidth, imageDomHeight} = await loadImageDom(dataURL);
    let resizedWidth = imageDomWidth;
    let resizedHeight = imageDomHeight;
    contentDom.style.width = `${resizedWidth}px`;
    contentDom.style.height = `${resizedHeight}px`;
    const spliterationYCount = resizedHeight / itemDomHeight;
    const spliterationXCount = resizedWidth / itemDomWidth;
    let c = 1;
    for (let y = 0; y < spliterationYCount; y++) {
      for (let x = 0; x < spliterationXCount; x++) {
        const itemDom = document.createElement('div');
        itemDom.classList.add('item');
        itemDom.setAttribute(`data-split-number`, `${y}-${x}`);
        itemDom.style.width = `${itemDomWidth}px`;
        itemDom.style.height = `${itemDomHeight}px`;
        itemDom.style.backgroundPositionY = `-${y * itemDomHeight}px`;
        itemDom.style.backgroundPositionX = `-${x * itemDomWidth}px`;
        itemDom.style.top = `${y * itemDomHeight}px`;
        itemDom.style.left = `${x * itemDomWidth}px`;
        itemDom.style.backgroundImage = `url(${dataURL})`;
        itemDom.style.backgroundSize = `auto`;
        itemDom.classList.add(`item-${c}`);
        contentDom.appendChild(itemDom);
        c = c + 1;
      }
    }
    resolve(c - 1);
  });
}

function loadCanvasDom(imageDom, itemWidth, itemHeight) {
  return new Promise((resolve) => {
    const canvasDom = document.createElement(`canvas`);
    const canvasDomContext = canvasDom.getContext('2d');
    canvasDom.width = itemWidth;
    canvasDom.height = itemHeight;
    canvasDomContext.drawImage(imageDom, 0, 0, itemWidth, itemHeight);
    resolve(canvasDom);
  });
}

function download() {
  const itemWidth = imageDomWidth / col;
  const itemHeight = imageDomHeight / row;
  const imageDomList = [...document.querySelectorAll(`img`)];
  let i = 0;
  return new Promise(async (resolve) => {
    const id = setInterval(() => {
      if (i >= imageDomList.length) {
        clearInterval(id);
        resolve();
      }

      const imageDom = imageDomList[i];
      if (imageDom) {
        const a = document.createElement('a');
        a.href = imageDom.src;
        a.download = `item-${i + 1}.webp`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      i++;
    }, 500);
  });
}

async function split() {
  if (!imageDom) {
    window.alert('upload file');
    return;
  }
  if (!row) {
    window.alert('input row');
    return;
  }
  if (!col) {
    window.alert('input col');
    return;
  }

  const contentDom = document.querySelector(`.content`);

  const canvasDom = await reflectImage2Canvas(imageDom, imageDomWidth, imageDomHeight, imageDomWidth, imageDomHeight);

  const dataURL = await getDataURL(canvasDom);

  const splitCount = await spliter(contentDom, dataURL, imageDomWidth / col, imageDomHeight / row);

  const perPercent = 100 / splitCount;

  for (let index = 1; index <= splitCount; index++) {
    const targetDom = document.querySelector(`.item-${index}`);
    if (targetDom) {
      const canvasDom = await html2canvas(targetDom);
      const cropDataURL = await getDataURL(canvasDom);
      const cropResult = await loadImageDom(cropDataURL);
      document.querySelector(`.output`).appendChild(cropResult.imageDom);
      percent = percent + perPercent;
    }
  }
  contentDom.parentElement.removeChild(contentDom);
}

function upload(event) {
  return new Promise(async (resolve) => {
    const fileObject = event.target.files[0];
    const objectURL = window.URL.createObjectURL(fileObject);
    const resultInfo = await loadImageDom(objectURL);
    publicURL = objectURL;
    imageDom = resultInfo.imageDom;
    imageDomWidth = resultInfo.imageDomWidth;
    imageDomHeight = resultInfo.imageDomHeight;
    resolve();
  });
}

let row = 0;
let col = 0;
let imageDom = null;
let imageDomWidth = 0;
let imageDomHeight = 0;
let publicURL = '';
let percent = 0;

const inputRowDom = document.querySelector(`input.row`);
inputRowDom.addEventListener(
  'change',
  (event) => {
    row = Number(event.target.value);
  },
  false
);

const inputColDom = document.querySelector(`input.col`);
inputColDom.addEventListener(
  'change',
  (event) => {
    col = Number(event.target.value);
  },
  false
);

const inputFileDom = document.querySelector(`input.file`);
inputFileDom.addEventListener(
  'change',
  async (event) => {
    await upload(event);
  },
  false
);

const splitButton = document.querySelector(`.split`);
splitButton.addEventListener(
  'click',
  async (event) => {
    await split();
  },
  false
);

const downloadButton = document.querySelector(`.download`);
downloadButton.addEventListener(
  'click',
  async (event) => {
    await download();
  },
  false
);

function niceRolling() {
  let count = 0;
  let moveX = 0;
  let reqId;

  function marquee() {
    function mod(n, m) {
      return ((n % m) + m) % m;
    }
    let a = new Date();
    moveX++;
    if (Math.ceil(percent) >= 100) {
      const progressTextDom = document.querySelector(`.progress-text`);
      const barDom = document.querySelector(`.bar`);
      progressTextDom.innerHTML = `${100} %`;
      barDom.style.width = `${100}%`;
      cancelAnimationFrame(reqId);
    } else {
      reqId = requestAnimationFrame(marquee);
      if (mod(moveX, 1) + 13 === 13) {
        const progressTextDom = document.querySelector(`.progress-text`);
        const barDom = document.querySelector(`.bar`);
        progressTextDom.innerHTML = `${Math.ceil(percent)} %`;
        barDom.style.width = `${Math.ceil(percent)}%`;
      }
    }
  }
  marquee();
}
niceRolling();
