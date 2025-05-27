// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {useState} from "react";
import * as React from "react";

export type Bill = {
  id: string
  userId: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  account: string;
}
function App() {
  // forgot formBill implementation
    // create an object called formData that is a bill but omit the id, userId and isPaid
    // set the value from the input to the keys from the object
    // method called to get the formBillData from the object
    // inside handlesubmit you trigger the method of above
    // use the onChange hook to get data from the inputs



  const emptyBill: Omit<Bill, "id" | "userId"> = {
    name: "",
    amount: 0,
    dueDate: 1,
    category: "",
    account: "",
  }

  const [formData, setFormData] = useState<Omit<Bill, "id" | "userId">>( emptyBill);

  const handleInputChange = (field: string, data: string | number) => {
    setFormData(prevState => ({...prevState, [field]: data}) );

    // validation
  }
  const getFormData = (): Bill => {
    const bill: Bill = {
      id: editBillId || Date.now().toString(),
      userId: "1",
      name: formData.name,
      amount: formData.amount,
      dueDate: formData.dueDate,
      category: formData.category,
      account: formData.account,
    };

    return bill;
  }

  // remember the logic for individually having state for each bill.
  // forgot the validation logic for the form.
  // forgot the emptyForm const

  const [bills, setBills] = useState<Bill[]>([]);

  const [editBillId, setBillId] = useState<string | null>( null );

  // forgot the logic for editing the bill in a stable manner
    // you still need a method to trigger the editBill and set the edit bill ID
  const isEditingBill = editBillId !== null ;

  // forgot the event type for the event

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const newBill = getFormData();

     if(!isEditingBill) {
       setBills(prevState => [...prevState, newBill])
     } else {
       setBills( prevState => prevState.map( bill => {
         if(bill.id === editBillId) {
           return newBill;
         }
         return bill
       }))
     }
     
     setFormData(() => ({...emptyBill}));
     setBillId(null); // Forget to reset form
  }


  const deleteBill = (targetBill: Bill) => {
    setBills( prevState => prevState.filter( bill => bill.id !== targetBill.id))
  }

  const startEditing = (targetBill: Bill) => {
    setBillId(targetBill.id);
    setFormData(targetBill);
  }


  return (
      <>
        <h1>Bill Tracker</h1>

        {/*forgot syntax for submit*/}
        <section>
          <form action="#" onSubmit={handleSubmit}>
            <label htmlFor="name">name</label>
            <input type="text" value={formData.name}
                   placeholder={"e.g. DTE"}
                   name={"name"}
                   onChange={ (e) => handleInputChange("name", e.target.value)}
            />

            {/*forgot trick for placeholdera*/}
            <label htmlFor="amount">amount</label>
            <input type="number"
                   value={formData.amount > 0 ? formData.amount : ''}
                   placeholder={"0.00"}
                   name={"amount"}
                   onChange={ (e) => handleInputChange("amount", parseFloat(e.target.value))}
            />

            {/*forgot the syntax for onchange in react and angular */}
            <label htmlFor="dueDate">dueDate</label>
            <input type="number"
                   name={"dueDate"}
                   value={formData.dueDate || ''}
                   placeholder={'15'}
                   onChange={ (e) => handleInputChange("dueDate", parseFloat(e.target.value))}
            />

            <label htmlFor="category">category</label>
            <input type="text"
                   name={"category"}
                   value={formData.category}
                   onChange={ (e) => handleInputChange("category", e.target.value)}
            />

            <label htmlFor="account">account</label>
            <input type="text"
                   name={"account"}
                   value={formData.account}
                   onChange={ (e) => handleInputChange("account", e.target.value)}
            />

            <input type="submit" value={isEditingBill ? "update" : "add"}/>
          </form>
        </section>

        <section>
          <table className={"w-full"}>
            <thead>
              <tr>
                <th>name</th>
                <th>amount</th>
                <th>due date</th>
                <th>category</th>
                <th>account</th>
              </tr>
            </thead>
            <tbody>
              {
                bills.map( bill => {

                  // forgot to add a key
                  return (
                      <tr key={bill.id}>
                        <td>{bill.name}</td>
                        <td>{bill.amount}</td>
                        <td>{bill.dueDate}</td>
                        <td>{bill.category}</td>
                        <td>{bill.account}</td>
                        <td>
                          <button onClick={() => startEditing(bill)}>Edit</button>
                          <button onClick={() => deleteBill(bill)}>delete</button>
                        </td>
                      </tr>
                  );
                })
              }

            </tbody>
          </table>
        </section>
      </>

  )
}

export default App
