import './App.css';
import { useState, useEffect } from "react"
import { connect } from "@argent/get-starknet"
import { Contract } from "starknet"
import { encodeShortString } from "starknet/dist/utils/shortString";

import contractAbi from "./abis/main_abi.json"

const contractAddress = "0x049e5c0e9fbb072d7f908e77e117c76d026b8daf9720fe1d74fa3309645eabce"

function App() {
  const [provider, setProvider] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [inputAddress, setInputAddress] = useState('')
  const [isConnected, setIsConnected] = useState('')

  const connectWallet = async() => {
    try{
      // using argentx
      const starknet = await connect()
      // connect to the wallet
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

  const setNameFunction = async() => {
    try{
      // initialize contract using abi, address and provider
      const contract = new Contract(contractAbi, contractAddress, provider)
      const nameToFelt = encodeShortString(name)
      await contract.storeName(nameToFelt)
      alert("You've successfully stored your name in the address!")
    }
    catch(error){
      alert(error.message)
      console.log(error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <main className="main">
          <h1 className="title">
            Starknet<a href="#"></a>
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
            <a href="#" className="card">
              <h2>Ensure to connect to Alpha-goerli! &rarr;</h2>
              <p>Insert a Name to store on Contract.</p>

              <div className="cardForm">
                <input type="text" className="input" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />

                <input type="submit" className="button" value="Store Name" onClick={() => setNameFunction()} />
              </div>

              <p>Name: </p>
            </a>
          </div>
        </main>
      </header>
    </div>
  );
}

export default App;
