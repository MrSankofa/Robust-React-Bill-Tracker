import './App.css'
import {useState} from "react";
import * as React from "react";

type Bill = {
    id: string,
    name: string;
    amount: number;
    dueDate: number;
    category: string;
    source: string;
    userId: string;
    isPaid: boolean;
}

function App() {
    // todo: parse out components and separate add bill page from the landing page which will be the dashboard
    // todo: you will need ids for your bills
    // todo: set up redux for bills
    // todo: implement editing for bills


    const [editingBillId, setEditingBillingId] = useState<string | null>( null);

    const isEditing = editingBillId !== null;
    const [formData, setFormData ] = useState( {
        id: JSON.stringify(Math.random()),
        name: '',
        dueDate: 1,
        category: '',
        source: '',
        amount: 0,
        isPaid: false,
        userId: "1"
    });

    const [errors, setErrors ] = useState<Record<string, string>>({})

    const [bills, setBills] = useState([] as Bill[]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData( prevState => ({ ...prevState, [field]: value}));

        if(errors[field]) setErrors( prevState => ({ ...prevState, [field]: ''}));
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if(!formData.name.trim()) {
            newErrors.name = 'Bill Name is required';
        }

        if(!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if(!formData.source.trim()) {
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

    const startEditing = ( bill: Bill) => {
        setFormData(bill);
        setEditingBillingId(bill.id)
    }


    const getFormBillData = (): Bill => ({
        id: editingBillId || Date.now().toString(),
        name: formData.name,
        amount: formData.amount,
        dueDate: formData.dueDate,
        category: formData.category,
        source: formData.source,
        userId: formData.userId,
        isPaid: editingBillId ? bills.find( b => b.id === editingBillId)?.isPaid ?? false : false
    });

    const emptyForm = {
        id: "",
        name: "",
        amount: 0,
        dueDate: 1,
        category: "",
        source: "",
        userId: "1",
        isPaid: false,
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if( !validateForm()) return;

        const newBill = getFormBillData();

        if(isEditing) {
            setBills( bills => bills.map( bill => {

                if(bill.id === editingBillId) {
                    return newBill
                }
                return bill
            }));
        } else {


            setBills( bills => [...bills, newBill]);
        }

        setFormData({...emptyForm});
        setEditingBillingId(null);


    }





    // TODO: isPaid is not showing on the graph.

  return (
      <>
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

              <div className="w-full max-w-5xl px-4">
                  <h1 className="text-4xl font-bold text-blue-600">{ isEditing ? "Update " : "Add " }Bill</h1>


                  <form onSubmit={handleSubmit} className={"w-full"}>
                      <label className={"form"} htmlFor="billName">Bill Name</label>
                      <input type="text" name={"billName"} placeholder={"e.g. DTE"} value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)}/>
                      <label className={"form"} htmlFor="billAmount" >Bill Amount</label>
                      <input type="number" name={"billAmount"} placeholder={"0.00"} value={formData.amount || ''} onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}/>
                      <label className={"form"} htmlFor="dueDate">Due Date</label>
                      <input type="number" name={"dueDate"} placeholder={'15'} value={formData.dueDate || ''} onChange={(e) => handleInputChange("dueDate", parseFloat(e.target.value))}/>
                      <label className={"form"} htmlFor="category">Category</label>
                      <input type="text" name={"category"} placeholder={"e.g. Unnecessary Bill"} value={formData.category} onChange={(e) => handleInputChange("category", e.target.value) }/>
                      <label className={"form"} htmlFor="source">Source</label>
                      <input type="text" name={"source"} placeholder={"e.g. chase"} value={formData.source} onChange={(e) => handleInputChange("source", e.target.value ) } />

                      <button className={"ml-100"} type="submit">{ isEditing ? "Update " : "Add " }</button>
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
                          <th>isPaid</th>
                      </tr>
                      </thead>
                      <tbody id={"bill-list"}>


                      { bills.map( bill => {
                          return <tr key={bill["id"]}>
                              <td> {bill["name"]}</td>
                              <td> {bill["amount"]}</td>
                              <td> {bill["dueDate"]}</td>
                              <td> {bill["category"]}</td>
                              <td> {bill["source"]}</td>
                              <td> {bill["isPaid"] ? "Yes" : "No"} </td>
                              <td>
                                  <button onClick={ () => { startEditing(bill)}}>Edit</button>
                              </td>
                          </tr>
                      })}
                      </tbody>
                  </table>


              </div>

          </div>

      </>
  )
}

export default App
