import typescript from '@rollup/plugin-typescript'
import tsConfig from './tsconfig.json' assert { type: 'json'}
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'


export default [{
  input: './src/factory.ts',
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    resolve({
      mainFields: ['exports']
    }),
    typescript(tsConfig),
    terser({
      mangle: false
    })
  ]
}, {
  input: './src/name-service.ts',
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    resolve({
      mainFields: ['exports']
    }),
    typescript(tsConfig),
    terser({
      mangle: false
    })
  ]
}, {
  input: './src/native-token.ts',
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    resolve({
      mainFields: ['exports']
    }),
    typescript(tsConfig),
    terser({
      mangle: false
    })
  ]
}, {
  input: './src/power-token.ts',
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    resolve({
      mainFields: ['exports']
    }),
    typescript(tsConfig),
    terser({
      mangle: false
    })
  ]
}, {
  input: './src/validators.ts',
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    resolve({
      mainFields: ['exports']
    }),
    typescript(tsConfig),
    terser({
      mangle: false
    })
  ]
}]
