import {build} from 'esbuild';
import fs from 'fs-extra';

(async () => {
  const niceCopy = (targetEntryList) => {
    return Promise.all(
      targetEntryList.map(async (entryInfo) => {
        await fs.copy(entryInfo.src, entryInfo.dest);
      })
    );
  };

  const prodBuildConfig = {
    prodBuildEntryInfoList: [
      {src: 'images', dest: 'dist/images'},
      {src: 'index.css', dest: 'dist/index.css'},
      {src: 'index.html', dest: 'dist/index.html'},
    ],
  };

  const {prodBuildEntryInfoList} = {...prodBuildConfig};

  await niceCopy(prodBuildEntryInfoList);

  const niceBuild = () => {
    return build({
      entryPoints: ['index.js'],
      outfile: 'dist/index.js',
      bundle: true,
      minify: true,
      sourcemap: true,
    });
  };

  await niceBuild();
})();
