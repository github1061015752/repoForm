/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'dompurify' {
  export default dompurify;
}

declare module 'blueimp-md5' {
  const MD5: (value: string, key?: string | null, raw?: boolean) => string;
  export default MD5;
}
