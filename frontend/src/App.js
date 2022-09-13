import './App.css';
import { useState, useEffect } from "react"
import { connect } from "get-starknet"
import { Contract } from "starknet"
import { toBN } from "starknet/dist/utils/number"
import { feltToString, stringToFelt } from './utils/utils'

import contractAbi from "./abis/main_abi.json"

const contractAddress = "0x049e5c0e9fbb072d7f908e77e117c76d026b8daf9720fe1d74fa3309645eabce"

function App() {
  const [provider, setProvider] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [inputAddress, setInputAddress] = useState('')
  const [retrievedName, setRetrievedName] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async() => {
    try{
      // let the user choose a starknet wallet
      const starknet = await connect()
      // connect to the user-chosen wallet
      await starknet?.enable({ starknetVersion: "v4" })
      // set account provider
      setProvider(starknet.account)
      // set user address
      setAddress(starknet.selectedAddress)
      // set connection status
      setIsConnected(true)
    }
    catch(error){
      alert(error.message)
    }
  }

  // persist state on reload
  useEffect(() => {
      connectWallet()
  }, [])

  const setNameFunction = async() => {
    try{
      // initialize contract using abi, address and provider
      const contract = new Contract(contractAbi, contractAddress, provider)
      // convert string to felt
      const nameToFelt = stringToFelt(name)
      // make contract call
      await contract.storeName(nameToFelt)
      alert("You've successfully associated your name with this address!")
    }
    catch(error){
      alert(error.message)
    }
  }

  const getNameFunction = async() => {
    try{
      // initialize contract using abi, address and provider
      const contract = new Contract(contractAbi, contractAddress, provider)
      // make contract call
      const _name = await contract.getName(inputAddress)
      // convert resulting felt to string
      const _decodedname = feltToString(toBN(_name.toString()))
      setRetrievedName(_decodedname)
    }
    catch(error){
      alert(error.message)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <main className="main">
          <h1 className="title">
            Starknet<a href="#"> ENS</a>
          </h1>
          {
            isConnected ?
            <button className="connect">{address.slice(0, 5)}...{address.slice(60)}</button> :
            <button className="connect" onClick={() => connectWallet()}>Connect wallet</button>
          }

          <p className="description">
            This demo app demonstrates the use of starknet.js to interact with starknet contracts
          </p>

          <div className="grid">
            <div href="#" className="card">
              <h2>Ensure to connect to Alpha-goerli! &rarr;</h2>
              <p>What name do you want?.</p>

              <div className="cardForm">
                <input type="text" className="input" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />

                <input type="submit" className="button" value="Store Name" onClick={() => setNameFunction()} />
              </div>

              <hr />

              <p>Insert a wallet address, to retrieve its name.</p>
              <div className="cardForm">
                <input type="text" className="input" placeholder="Enter Address" onChange={(e) => setInputAddress(e.target.value)} />

                <input type="submit" className="button" value="Get Name" onClick={() => getNameFunction()} />
              </div>
              <p>Name: {retrievedName}.eth</p>
            </div>
          </div>
        </main>
      </header>
    </div>
  );
}

export default App;
