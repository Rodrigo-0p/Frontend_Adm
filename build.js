const { build  }   = require('esbuild');

const REACT_APP_BASEURL   ='http://192.168.100.12:4000'

build({  
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'build/Bundle.js',
  loader: {
    '.js': 'jsx', // Configuración para cargar archivos .js como JSX
    '.css': 'css',
    '.png': 'dataurl', // Configuración para cargar archivos .png como archivos
    '.ttf': 'file', // Configuración para cargar archivos .ttf como archivos
    '.svg': 'dataurl', // Configuración para cargar archivos .svg como archivos
    '.woff': 'file', // Configuración para cargar archivos .woff como archivos
    '.woff2': 'file' // Configuración para cargar archivos .woff2 como archivos
  },
  define: {
    'process.env.REACT_APP_BASEURL'   : JSON.stringify(REACT_APP_BASEURL)  ,
  },
  format: 'cjs',       // Formato de salida
  minify: true,        // Minificar el código
  // minifyIdentifiers:true, // Cambia la variable en nombres mas corto
  minifySyntax:true,
  // sourcemap: false     // Generar sourcemap
}).catch(() => process.exit(1));