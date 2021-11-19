import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Web3ReactProvider } from '@web3-react/core'
import { getProvider } from '../utils/web3';
import Layout from '../components/layout';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props: any) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', 'brand.purple')(props),
    },
  }),
};

// https://coolors.co/ffbe0b-fb5607-ff006e-8338ec-3a86ff
const dlTheme = {
  colors: {
    brand: {
      100: "#FFC8DD",
      900: "#FF006E", // winter sky
      800: "#FFBE0B", // mango
      700: "#8338EC", // blue violet
      purple: "#3A0CA3",
      aquamarine: "#80FFDB",
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
}

const theme = extendTheme(dlTheme)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider  getLibrary={getProvider}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
