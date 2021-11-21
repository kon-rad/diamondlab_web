import { ethers } from 'ethers';
// import abis from '@unlock-protocol/contracts';
import { Web3Provider } from '@ethersproject/providers'
import abis from '@unlock-protocol/contracts'
// import { UnlockV8 } from '@unlock-protocol/contracts'

const LOCK_ADDRESS = '0x170Ecd1F389b66ef37119bd357B5ceD2B40BEBDd'

// Wrapping all calls in an async block
const subscribe = async (address: string, provider: Web3Provider) => {
  const ethersProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
  const signer = provider.getSigner();
  // We will interact with a lock deployed on rinkeby at this address 0xafa8fE6D93174D17D98E7A539A90a2EFBC0c0Fc1

  // Let's go purchase the membership for this lock
  const lock = new ethers.Contract(LOCK_ADDRESS, abis.PublicLockV8.abi, signer)

  // If the lock was using an ERC20 as currency, we would need to send an approval transaction on the ERC20 contract first...

  // Let's get the key price so we know how much we need to send (we could send more!)
  const amount = await lock.keyPrice()

  // Purchase params:
  const purchaseParams = [
        amount,
        address, // This is the recipient of the membership (us!)
        address, // The is the referrer who will earn UDT tokens (we'd like this to be us!)
    [], // empty data object (not used here)
  ]

  const gasPrice = await ethersProvider.getGasPrice() // Let's get the current gas price
  const options: any = {
    gasPrice,
    value: amount // This is a lock that uses Ether, so it means we need send value. If it was an ERC20 we could set this to 0 and just use the amount on purchase's first argument
  }

  // Important: we need to compute the gasLimit ourselves because it is a funcion of gasPrice
  // For safety we could also bump it (the user is refunded the difference anyway)
  const gasEstimate = await lock.estimateGas.purchase(...purchaseParams, options)
  options.gasLimit = gasEstimate

  // We can now send transactions to modify the state of the lock, like purchase a key!
  const transaction = await lock.purchase(...purchaseParams, options)
  const receipt = await transaction.wait()
  return receipt;
}

export default subscribe;