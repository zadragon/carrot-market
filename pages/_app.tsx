import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
// 프리즈마 연결
//pscale connect carrot-market

export default MyApp
