import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import alias from '@rollup/plugin-alias';
import vueJsx from '@vitejs/plugin-vue-jsx';
import replace from '@rollup/plugin-replace';

const root = process.cwd();
const builtAt = (function getBuildTime() {
  const d = new Date();

  if (Date.prototype?.toISOString != null) {
    const ts = d.getTime() - d.getTimezoneOffset() * 60000;
    return new Date(ts).toISOString().slice(0, -1).split('T').join(' ');
  }
  const date = d.toLocaleDateString().split('/').join('-');
  const time = d.toTimeString().split(' ')[0];
  return [date, time].join(' ');
})();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    alias({
      entries: {
        '@': resolve(root, './src')
      } as any
    }),
    replace({
      preventAssignment: true,
      values: {
        st_replace_built_at: JSON.stringify(builtAt)
      }
    }),
    vue(),
    vueJsx()
  ],
  envDir: resolve(root),
  envPrefix: 'xx_',
  server: {
    port: 8080
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        login: resolve(root, './index.html'),
        redirect: resolve(root, './redirect/index.html')
        // web: resolve(root, './web/index.html'),
        // sdk: resolve(root, './sdk/index.html')
      }
    }
  }
});
