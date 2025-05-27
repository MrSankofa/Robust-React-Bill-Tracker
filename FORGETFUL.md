
1. using state for form data
2. how to two way bind form data object to html
3. method for getting form data 
4. onchange syntax and method
5. validation for form
6. writing test for these features
7. creating an emptyBill object
8. how to tie bill id to isEditing logic for updating a bill
9. forgot the event type for the event
10. syntax for form submit for handleSubmit
11. input placeholder trick
12. adding a key when using a map in your jsx
13. how you should update the form when click edit, updating state


Answers

1. using state for form data

const [formData, setFormData] = useState<Omit<Bill, "id" | "userId">>( emptyBill);

2. how to two way bind form data object to html

```jsx
    <input type="text" value={formData.name}
           placeholder={"e.g. DTE"}
           name={"name"} />
```

3. method for getting form data (form data only has a partial of the required bill interface type)

```ts
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
```

4. onchange syntax and method

```ts
const handleInputChange = (field: string, data: string | number) => {
    setFormData(prevState => ({...prevState, [field]: data}) );

    // validation
  }
```

```jsx
<input type="text" value={formData.name}
       placeholder={"e.g. DTE"}
       name={"name"}
       onChange={ (e) => handleInputChange("name", e.target.value)}
/>
```

5. validation for form

6. writing test for these features

7. creating an emptyBill object

```ts
const emptyBill: Omit<Bill, "id" | "userId"> = {
    name: "",
    amount: 0,
    dueDate: 1,
    category: "",
    account: "",
}
```

8. how to tie bill id to isEditing logic for updating a bill

```ts
const [editBillId, setBillId] = useState<string | null>( null );

const isEditingBill = editBillId !== null ;

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

```

9. forgot the event type for the event

```ts
    (e: React.FormEvent) => {};
```

10. syntax for form submit for handleSubmit

```html
    <form action="#" onSubmit={handleSubmit}></form>
```


11. input placeholder trick

```jsx
 <input value={formData.dueDate || ''}  />
```


12. adding a key when using a map in your jsx

```jsx
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
```

13. how you should update the form when click edit, updating state

```jsx
const startEditing = (targetBill: Bill) => {
  setBillId(targetBill.id);
  setFormData(targetBill);
}
```
