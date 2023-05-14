import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import createResolver from 'vite-plugin-node-externals';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()
  //   createResolver({
  //   resolve: {
  //     '@emotion/react': {
  //       'CacheProvider': '@emotion/react'
  //     }
  //   }
  // })
  ,],
})
