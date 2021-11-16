import logo from './logo.svg';
import './App.css';
import React ,{useState,useEffect} from 'react'
import web3 from './web3';
import lottery from './lottery';
function App() {
  const [manager,setManager]=useState('');
  const [players,setPlayers]=useState([]);
  const [bal,setBal]=useState('');
  const [val,setVal]=useState('');
  const [message,setMessage]=useState('');
  useEffect(async ()=>{
    const m=await lottery.methods.manager().call();
    const p=await lottery.methods.getPlayers().call();
    const b=await web3.eth.getBalance(lottery.options.address);
    setManager(m);
    setPlayers(p);
    setBal(b);
  },[])
  const onsubmit=async (event)=>{
    event.preventDefault();
    const accounts=await web3.eth.getAccounts();
    setMessage('Entering into Lottery. Please Wait!!');
    await lottery.methods.enter().send({from:accounts[0],value:web3.utils.toWei(val,'ether')})
    setMessage('Successfully Entered!!!')
  }
  const onclick=async (event)=>{
    const accounts=await web3.eth.getAccounts();
    setMessage('Waiting on transaction success')
    await lottery.methods.pickWinner().send(
      {
        from:accounts[0]
      }
    )
    setMessage('A winner has been picked')
  }
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by :{manager}</p>
      <p>There are currently {players.length} players in the lottery and {web3.utils.fromWei(bal,'ether')} ether at stake</p>
      <hr />
      <form onSubmit={onsubmit}>
        <h4> Want to Try Luck</h4>
        Amount of ether
        <input value={val} onChange={(event)=>setVal(event.target.value)}></input>
        <br />
        <button>Enter</button>
      </form>
      <h1>{message}</h1>
      <hr />
        <h4>Time to pick a picker</h4>
        <button onClick={onclick}>Pick a Winner</button>
      <hr />
    </div>
  );
}

export default App;
