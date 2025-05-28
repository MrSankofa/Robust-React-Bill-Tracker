import './App.css'
import * as React from "react";
import {useState} from "react";

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
        name: '',
        amount: 0,
        dueDate: 0,
        category: '',
        account: '',
    }
    const [formData, setFormData] = useState(emptyBill);
    const [editBillId, setEditBillId] = useState<string | null>(null);
    const [bills, setBills] = useState<Bill[]>([]);

    const isEditing = editBillId !== null;

    const getFormData = (id: string) => {
        const newBill: Bill = {
            id,
            userId: '1',
            name: formData.name,
            amount: formData.amount,
            dueDate: formData.dueDate,
            category: formData.category,
            account: formData.account,
        }

        return newBill;
    }


    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const id: string = editBillId || Date.now().toString();

      const newBill: Bill = getFormData(id);

      if(isEditing) {
          setBills(prevState => prevState.map( bill => {
              if( bill.id === editBillId) {
                  return newBill;
              }

              return bill;
          }))
      } else {
          setBills( prevState => [...prevState, newBill]);
      }

      setFormData(emptyBill);
      setEditBillId(null);
    };

    const handleInputChange = (field: string, data: string | number) => {
        setFormData( prevState => ({...prevState, [field]: data}));
    }

    const startEditing = (targetBill: Bill) => {
        setFormData(targetBill);
        setEditBillId(targetBill.id);
    }

    const deleteBill = (targetBill: Bill) => {

        setBills(prevState => prevState.filter( bill => bill.id !== targetBill.id));
    }

  return (
      <>
        <h1>Bill Tracker</h1>

        <section>
            <form action="#" onSubmit={handleSubmit}>
                <label htmlFor="name">name</label>
                <input autoComplete={"off"} id={"name"} type="text" value={formData.name}
                       placeholder={"e.g. DTE"}
                       onChange={(e) => handleInputChange("name", e.target.value)}/>

                <label htmlFor="amount">amount</label>
                <input autoComplete={"off"} id={"amount"} type="number" value={formData.amount || ''}
                       placeholder={"0.00"}
                       onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}/>

                <label htmlFor="dueDate">dueDate</label>
                <input autoComplete={"off"} id={"dueDate"} type="number" value={formData.dueDate || ''}
                       placeholder={"15"}
                       onChange={(e) => handleInputChange("dueDate", parseFloat(e.target.value))}/>

                <label htmlFor="category">category</label>
                <input autoComplete={"off"} id={"category"} type="text" value={formData.category}
                       placeholder={"e.g. fmb"}
                       onChange={(e) => handleInputChange("category", e.target.value)}/>

                <label htmlFor="account">account</label>
                <input autoComplete={"off"} id={"account"} type="text" value={formData.account}
                       placeholder={"chase"}
                       onChange={(e) => handleInputChange("account", e.target.value)}/>


                <input type="submit" value={isEditing ? "Update Bill" : "Add Bill"}/>
            </form>
        </section>

          <section>
              <table>
                  <thead>
                    <tr>
                        <th>name</th>
                        <th>amount</th>
                        <th>dueDate</th>
                        <th>category</th>
                        <th>account</th>
                    </tr>
                  </thead>
                  <tbody>
                      {
                       bills.map( (bill:Bill) => (
                           <tr key={bill.id}>
                               <td>{bill.name}</td>
                               <td>{bill.amount}</td>
                               <td>{bill.dueDate}</td>
                               <td>{bill.category}</td>
                               <td>{bill.account}</td>
                               <td onClick={() => startEditing(bill)}>edit</td>
                               <td onClick={ () => deleteBill(bill)}>delete</td>
                           </tr>
                       ))
                      }
                  </tbody>
              </table>
          </section>
      </>
  )
}

export default App
