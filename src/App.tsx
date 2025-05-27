// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import {useState} from "react";
import * as React from "react";

type Bill = {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  account: string;
}
function App() {
  const emptyBill: Omit<Bill, "id" | "userId"> = {
    name: "",
    amount: 0, // something isn't right about this
    dueDate: 0,
    category: "",
    account: ""
  };

  const [formData, setFormData] = useState<Omit<Bill, "id" | "userId">>(emptyBill);

  const [editingBillId, setEditingBillId] = useState<string | null>(null);

  const [bills, setBills] = useState<Bill[]>([]);

  const isEditing = editingBillId !== null;

  const getFormData = (): Bill => {
    const newBill: Bill = {
      id: editingBillId || Date.now().toString(), // this doesn't seem right. it wasn't right id: Date.now().toString(),
      userId: '1',
      name: formData.name,
      amount: formData.amount,
      dueDate: formData.dueDate,
      category: formData.category,
      account: formData.account
    }

    return newBill
  }

  const handleInputChange = (field: string, data: string | number) => {
    setFormData( prevState => ({...prevState, [field]: data}));

    // validation
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBill = getFormData(); // this creates a new billId each time. That doesn't seem right

    if(isEditing) {
      setBills( prevState => prevState.map( bill => {
        if(bill.id === editingBillId) {
          newBill.id = editingBillId;
          return newBill;
        }
        return bill;
      }));

    } else {
      setBills( prevState => [...prevState, newBill])
    }

    setFormData(emptyBill);
    setEditingBillId(null);
  }

  const startEditing = (targetBill: Bill) => {
    setFormData(targetBill); // order matters
    setEditingBillId(targetBill.id); // order matters
  }

  const deleteBill = (targetBill: Bill) => {
    setBills(prevState => (prevState.filter( bill => bill.id !== targetBill.id)));
  }



  return (
    <>
      <h1>Bill Tracker</h1>

      <section>
        <form action="#" onSubmit={handleSubmit}>
          <label htmlFor="name">name </label>
          <input type="text"
                 value={formData.name}
                 placeholder={"e.g. DTE"}
                 onChange={(e) => handleInputChange("name", e.target.value)}/>

          <label htmlFor="amount">amount </label>
          <input type="number"
                 value={formData.amount || ''}
                 placeholder={"0.00"}
                 onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}/>

          <label htmlFor="dueDate">dueDate </label>
          <input type="number"
                 value={formData.dueDate || ''}
                 placeholder={"15"}
                 onChange={(e) => handleInputChange("dueDate", parseFloat(e.target.value))}/>

          <label htmlFor="category">category </label>
          <input type="text"
                 value={formData.category}
                 placeholder={"e.g. fmb"}
                 onChange={(e) => handleInputChange("category", e.target.value)}/>

          <label htmlFor="account">account </label>
          <input type="text"
                 value={formData.account}
                 placeholder={"e.g. chase"}
                 onChange={(e) => handleInputChange("account", e.target.value)}/>

          <input type="submit" value={isEditing ? "Update Bill" : "Add Bill"}/>
        </form>

      </section>


      <section>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Category</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>

          { bills.map( bill => (
              <tr key={bill.id}>

                <td>{bill.name}</td>
                <td>{bill.amount}</td>
                <td>{bill.dueDate}</td>
                <td>{bill.category}</td>
                <td>{bill.account}</td>
                <td>
                  <button onClick={() => startEditing(bill)}>edit</button>
                  <button onClick={() => deleteBill(bill)}>delete</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </section>


    </>

  )
}

export default App
