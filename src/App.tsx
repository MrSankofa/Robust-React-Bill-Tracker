import './App.css'
import * as React from "react";
import {useEffect, useState} from "react";

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

    const BASE_URL = "http://localhost:8080/api/bills";
    const USER_ID = "1";

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

    useEffect(() => {
        fetch(`${BASE_URL}?userId=${USER_ID}`)
            .then(res => res.json())
            .then(setBills)
            .catch(err => console.error("Failed to fetch bills", err));
    }, []);

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
    const [errors, setErrors ] = useState<Record<string, string>>({})


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if(!formData.name.trim()) {
            newErrors.name = 'Bill Name is required';
        }

        if(!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if(!formData.account.trim()) {
            newErrors.source = 'source is required';
        }

        if(formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if(formData.dueDate < 1 || formData.dueDate > 31) {
            newErrors.dueDate = 'Due date must be between 1 and 31';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

        if( !validateForm()) return;

      const id: string = editBillId || Date.now().toString();

      const newBill: Bill = getFormData(id);

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${BASE_URL}/${id}` : BASE_URL;

      try {
          const response = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json"},
              body: JSON.stringify(newBill)
          });

          if (!response.ok) throw new Error("failed to save bill");

          const savedBill = await response.json();

          setBills( prev => isEditing ?
            prev.map( bill => bill.id === id ? savedBill : bill) :
            [...prev, savedBill]
          );

          setFormData(emptyBill);
          setEditBillId(null);
      }  catch (err) {
          console.log("Error saving bill: ", err);
      }

    };

    const handleInputChange = (field: string, data: string | number) => {

        setFormData( prevState => ({...prevState, [field]: data}));

    }

    const startEditing = (targetBill: Bill) => {
        setFormData(targetBill);
        setEditBillId(targetBill.id);
    }

    const deleteBill = async (targetBill: Bill) => {

        try {
            const response = await fetch(`${BASE_URL}/${targetBill.id}`, {
                method: "DELETE"
            })

            if(response.status === 204) {
                setBills(prevState => prevState.filter( bill => bill.id !== targetBill.id));
            } else {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            console.error("Error deleting bill:", err);
        }

        setBills(prevState => prevState.filter( bill => bill.id !== targetBill.id));
    }

  return (
      <>
        <h1>Bill Tracker</h1>

        <section>
            <form action="#" onSubmit={handleSubmit}>
                <label htmlFor="name">name</label>
                <input autoComplete={"off"} id={"name"} type="text" value={formData.name}  className={errors.name ? 'border-red-500' : ''}
                       placeholder={"e.g. DTE"}
                       onChange={(e) => handleInputChange("name", e.target.value)}/>

                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                <label htmlFor="amount">amount</label>
                <input autoComplete={"off"} id={"amount"} type="number" value={formData.amount || ''}  className={errors.amount ? 'border-red-500' : ''}
                       placeholder={"0.00"}
                       onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}/>

                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                <label htmlFor="dueDate">dueDate</label>
                <input autoComplete={"off"} id={"dueDate"} type="number" value={formData.dueDate || ''}  className={errors.dueDate ? 'border-red-500' : ''}
                       placeholder={"15"}
                       onChange={(e) => handleInputChange("dueDate", parseFloat(e.target.value))}/>

                {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
                <label htmlFor="category">category</label>
                <input autoComplete={"off"} id={"category"} type="text" value={formData.category}  className={errors.category ? 'border-red-500' : ''}
                       placeholder={"e.g. fmb"}
                       onChange={(e) => handleInputChange("category", e.target.value)}/>

                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                <label htmlFor="account">account</label>
                <input autoComplete={"off"} id={"account"} type="text" value={formData.account}  className={errors.account ? 'border-red-500' : ''}
                       placeholder={"chase"}
                       onChange={(e) => handleInputChange("account", e.target.value)}/>


                {errors.account && <p className="text-red-500 text-sm">{errors.account}</p>}
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
                               <td>
                                   <button  onClick={() => startEditing(bill)}>edit</button>
                               </td>

                               <td>
                                   <button   onClick={ () => deleteBill(bill)}>delete</button>
                               </td>
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
