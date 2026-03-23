import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// When deploying to GitHub Pages under a repository (user.github.io/<repo>),
// set the `base` option to the repository name path so assets load correctly.
export default defineConfig({
  base: '/thanos/',
  plugins: [svelte()]
})
