import './App.css'
import {useState} from "react";

function App() {


    const [bills, setBills] = useState([{
        billName: "ziegler",
        amount: 1490,
        dueDate: 1,
        category: "Fixed Monthly Bills",
        source: "Ziegler",
    }]);



    const [billName, setBillName] = useState("");
    const [amount, setAmount] = useState(0);
    const [dueDate, setDueDate] = useState(0);
    const [category, setCategory] = useState("");
    const [source, setSource] = useState("");


    const addBill = () => {
        const bill = {
            billName,
            amount,
            dueDate,
            category,
            source
        };

        setBills( (bills) => [...bills, bill] );

        setBillName(() => "");
        setAmount(() => 0);
        setDueDate(() => 0);
        setCategory(() => "");
        setSource(() => "");
    }



  return (
      <>
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

              <div className="w-full max-w-5xl px-4">
                  <h1 className="text-4xl font-bold text-blue-600">Add / Update Bill</h1>


                  <form className={"w-full"}>
                      <label className={"form"} htmlFor="billName">Bill Name</label>
                      <input type="text" name={"billName"} value={billName} onChange={(e) => setBillName(e.target.value)}/>
                      <label className={"form"} htmlFor="billAmount" >Bill Amount</label>
                      <input type="text" name={"billAmount"} value={amount} onChange={(e) => setAmount(e.target.value)}/>
                      <label className={"form"} htmlFor="dueDate">Due Date</label>
                      <input type="text" name={"dueDate"} value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
                      <label className={"form"} htmlFor="category">Category</label>
                      <input type="text" name={"category"} value={category} onChange={(e) => setCategory(e.target.value)}/>
                      <label className={"form"} htmlFor="source">Source</label>
                      <input type="text" name={"source"} value={source} onChange={(e) => setSource(e.target.value)}/>

                      <input onClick={() => addBill()} className={"ml-100"} type="button" value={"Add/Update"}/>
                  </form>

              </div>


              <div className="w-full max-w-5xl px-4 mt-8">

                  <h1>Bill List</h1>

                  <table className={"w-100 w-full"}>
                      <thead>
                      <tr>
                          <th>Bill Name</th>
                          <th>Bill Amount</th>
                          <th>Due Date</th>
                          <th>Category</th>
                          <th>Source</th>
                      </tr>
                      </thead>
                      <tbody id={"bill-list"}>


                      { bills.map( data => {
                          return <tr>
                              <td> {data["billName"]}</td>
                              <td> {data["amount"]}</td>
                              <td> {data["dueDate"]}</td>
                              <td> {data["category"]}</td>
                              <td> {data["source"]}</td>
                          </tr>
                      })}
                      </tbody>
                  </table>


              </div>

          </div>

      </>


      // <>
      //   <div>
      //     <a href="https://vite.dev" target="_blank">
      //       <img src={viteLogo} className="logo" alt="Vite logo" />
      //     </a>
      //     <a href="https://react.dev" target="_blank">
      //       <img src={reactLogo} className="logo react" alt="React logo" />
      //     </a>
      //   </div>
      //   <h1>Vite + React</h1>
      //   <div className="card">
      //     <button onClick={() => setCount((count) => count + 1)}>
      //       count is {count}
      //     </button>
      //     <p>
      //       Edit <code>src/App.tsx</code> and save to test HMR
      //     </p>
      //   </div>
      //   <p className="read-the-docs">
      //     Click on the Vite and React logos to learn more
      //   </p>
      // </>
  )
}

export default App
