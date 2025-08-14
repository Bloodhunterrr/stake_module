// declare const require: {
//     context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => {
//       keys: () => string[];
//       <T = unknown>(id: string): T;
//     };
//   };
//
// const skinsContext = require.context(
//     '../../skins',
//     true,
//     /\.(png|jpe?g|svg|gif)$/
//   );
//
//   const defaultAssets = require.context(
//     '../assets',
//     true,
//     /\.(png|jpe?g|svg|gif)$/
//   );
//
//   const skinName = process.env.REACT_APP_SKIN_NAME?.toLowerCase() || 'default';
//
//   export function loadAsset(assetPath: string): string {
//     const skinAssetPath = `./${skinName}/${assetPath}`;
//     const defaultAssetPath = `./${assetPath}`;
//
//     if (skinsContext.keys().includes(skinAssetPath)) {
//       return skinsContext(skinAssetPath);
//     }
//
//     if (defaultAssets.keys().includes(defaultAssetPath)) {
//       return defaultAssets(defaultAssetPath);
//     }
//
//     console.error(`Asset not found in skin or default: ${assetPath}`);
//     return '';
//   }
//

export function loadAsset(assetPath: string): string {
  return ''
}
