import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Web3ReactProvider } from '@web3-react/core'
import { getProvider } from '../utils/web3';
import Layout from '../components/layout';
import { mode } from '@chakra-ui/theme-tools';
import { SEO } from '../components/seo'
import "@fontsource/syne"

const styles = {
  global: (props: any) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', 'brand.darkslategray')(props),
    },
  }),
};

// https://coolors.co/ffbe0b-fb5607-ff006e-8338ec-3a86ff
// background: #654ea3;  /* fallback for old browsers */
// background: -webkit-linear-gradient(to right, #eaafc8, #654ea3);  /* Chrome 10-25, Safari 5.1-6 */
// background: linear-gradient(to right, #eaafc8, #654ea3); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

const dlTheme = {
  colors: {
    brand: {
      100: "#FFC8DD",
      900: "#FF006E", // winter sky
      800: "#FFBE0B", // mango
      700: "#8338EC", // blue violet
      purple: "#3A0CA3",
      aquamarine: "#80FFDB",
      darkslategray: "#222429",
      gradienta: "linear-gradient(to right, #eaafc8, #654ea3)",
      flickrPink: "#f72585ff",
      fonta: "Syne"
    },
  },
  components: {
    Button: {
      baseStyle: {
        color: 'gray.100',
      },
      variants: {
        primary: {
          color: "gray.100"
        },
        bright: {
          backgroundColor: "linear-gradient(to right, #eaafc8, #654ea3)",
        }
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.100',
      },
      variants: {
        primary: {
          color: "gray.100"
        },
      },
    }
  },
  styles,
  fonts: {
    heading: "Syne",
    body: "Syne",
  },
}

const theme = extendTheme(dlTheme)

declare global {
  interface Window {
    ethereum: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider  getLibrary={getProvider}>
      <ChakraProvider theme={theme}>
        <SEO />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
