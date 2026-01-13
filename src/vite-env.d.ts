/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  readonly VITE_PRODUCT_NAME: string;
  readonly VITE_BRAND_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SOLUTION_TYPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}