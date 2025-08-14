declare const require: {
    context: (
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ) => {
      keys: () => string[];
      <T = unknown>(id: string): T;
    };
  };
  
  const skinName = process.env.REACT_APP_SKIN_NAME?.toLowerCase() || 'default';
  
  const skinStylesContext = require.context(
    '../../skins',
    true,
    /^\.\/[^/]+\/style\.css$/
  );
  
  const defaultStylesContext = require.context(
    '../assets',
    false,
    /style\.css$/
  );
  

  export function loadSkinStyle(): void {
    const skinStylePath = `./${skinName}/style.css`;
    const defaultStylePath = './style.css';
  
    try {
      if (skinStylesContext.keys().includes(skinStylePath)) {
        skinStylesContext(skinStylePath);
        return;
      }
  
      if (defaultStylesContext.keys().includes(defaultStylePath)) {
        defaultStylesContext(defaultStylePath);
        return;
      }
  
      console.warn(`No style.css found for skin "${skinName}" or default.`);
    } catch (error) {
      console.error(`Failed to load style.css for "${skinName}":`, error);
    }
  }
  