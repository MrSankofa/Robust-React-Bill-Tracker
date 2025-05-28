import { useEffect, useState } from "react";
import * as React from "react";

export type Bill = {
    id: string;
    name: string;
    amount: number;
    dueDate: number;
    category: string;
    account: string;
};

const BASE_URL = "http://localhost:8080/api/bills";

const emptyBill: Omit<Bill, "id" > = {
    name: "",
    amount: 0,
    dueDate: 0,
    category: "",
    account: "",
};

export const useBills = (authToken: string | null, onUnauthorized: () => void ) => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [formData, setFormdata] = useState<Omit<Bill, 'id'>>(emptyBill);

    const [editBillId, setEditBillId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        (async () => {
            if(!authToken) return;

            try {
                const res = await fetch(BASE_URL, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });

                if(res.status === 401) {
                    onUnauthorized();
                    throw new Error('Unauthorized');
                }

                const data = await res.json();
                setBills(data);

            } catch (err) {
                console.error('Failed to fetch bills', err);
            }
        })();
    }, [authToken]);

    const isEditing = editBillId !== null;

    const getFormData = (id: string): Bill => ({
        id,
        ...formData
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if( !formData.name.trim()) newErrors.name = 'Bill Name is required';
        if( !formData.category.trim()) newErrors.category = 'Category is required';
        if( !formData.account.trim()) newErrors.account = 'Account is required';
        if( formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
        if( formData.dueDate < 1 || formData.dueDate > 31 ) newErrors.dueDate = 'Due date must be between 1 and 31';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if( !validateForm()) return;

        const id = editBillId || Date.now().toString();
        const newBill = getFormData(id);

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${BASE_URL}/${id}` : BASE_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify(newBill)
            });

            if(response.status === 401) {
                onUnauthorized();
                throw new Error('Unauthorized');
            }

            if( !response.ok) throw new Error('Failed to save bill');

            const savedBill = await response.json();
            setBills(prevState => isEditing ? prevState.map( bill => bill.id === id ? savedBill : bill) : [...prevState, savedBill]);
            setFormdata(emptyBill);
            setEditBillId(null)
        } catch (err) {
            console.error('Error saving bill: ', err);
        }
    }

    const handleInputChange = (field: string, value: string | number ) => {
        setFormdata((prevState) => ({...prevState, [field]: value}));
    }

    const startEditing = (bill: Bill) => {
        setFormdata(bill);
        setEditBillId(bill.id);
    }

    const deleteBill = async (bill: Bill) => {
        try {
            const response = await fetch(`${BASE_URL}/${bill.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if( response.status === 401) {
                onUnauthorized();
                throw new Error('Unauthorized');
            }

            if(response.status === 204) {
                setBills(prevState => prevState.filter(bill => bill.id !== bill.id));
            } else {
                throw new Error('Failed to delete')
            }
        } catch (err) {
            console.error('Error deleting bill: ', err);
        }
    }

    return {
        bills,
        formData,
        errors,
        isEditing,
        handleSubmit,
        handleInputChange,
        startEditing,
        deleteBill
    }
}


/*
*
* import { useEffect, useState } from 'react';
import { Bill } from './types';

const BASE_URL = 'http://localhost:8080/api/bills';

export const useBills = (authToken: string | null, onUnauthorized: () => void) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [formData, setFormData] = useState<Omit<Bill, 'id' | 'userId'>>({
    name: '',
    amount: 0,
    dueDate: 0,
    category: '',
    account: ''
  });
  const [editBillId, setEditBillId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authToken) return;

    fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then((res) => {
        if (res.status === 401) {
          onUnauthorized();
          return Promise.reject('Unauthorized');
        }
        return res.json();
      })
      .then(setBills)
      .catch((err) => console.error('Failed to fetch bills', err));
  }, [authToken]);

  const isEditing = editBillId !== null;

  const getFormData = (id: string): Bill => ({
    id,
    userId: '', // This is handled on backend via JWT, left blank here
    ...formData
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Bill Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.account.trim()) newErrors.account = 'Account is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (formData.dueDate < 1 || formData.dueDate > 31)
      newErrors.dueDate = 'Due date must be between 1 and 31';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const id = editBillId || Date.now().toString();
    const newBill = getFormData(id);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${BASE_URL}/${id}` : BASE_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(newBill)
      });

      if (response.status === 401) {
        onUnauthorized();
        throw new Error('Unauthorized');
      }
      if (!response.ok) throw new Error('Failed to save bill');

      const savedBill = await response.json();
      setBills((prev) =>
        isEditing ? prev.map((b) => (b.id === id ? savedBill : b)) : [...prev, savedBill]
      );

      setFormData({ name: '', amount: 0, dueDate: 0, category: '', account: '' });
      setEditBillId(null);
    } catch (err) {
      console.error('Error saving bill:', err);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = (bill: Bill) => {
    setFormData(bill);
    setEditBillId(bill.id);
  };

  const deleteBill = async (bill: Bill) => {
    try {
      const response = await fetch(`${BASE_URL}/${bill.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.status === 401) {
        onUnauthorized();
        throw new Error('Unauthorized');
      }
      if (response.status === 204) {
        setBills((prev) => prev.filter((b) => b.id !== bill.id));
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting bill:', err);
    }
  };

  return {
    bills,
    formData,
    errors,
    isEditing,
    handleSubmit,
    handleInputChange,
    startEditing,
    deleteBill
  };
};
* */
