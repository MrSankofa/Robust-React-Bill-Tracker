import { useEffect, useState } from "react";

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

export function useBills() {
    const [formData, setFormData] = useState(emptyBill);
    const [editBillId, setEditBillId] = useState<string | null>(null);
    const [bills, setBills] = useState<Bill[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = editBillId !== null;

    useEffect(() => {
        const token = localStorage.getItem("token"); // or from context

        fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch bills");
                return res.json();
            })
            .then(setBills)
            .catch((err) => console.error("Failed to fetch bills", err));
    }, []);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Bill Name is required";
        if (!formData.category.trim()) newErrors.category = "Category is required";
        if (!formData.account.trim()) newErrors.account = "Account is required";
        if (formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
        if (formData.dueDate < 1 || formData.dueDate > 31)
            newErrors.dueDate = "Due date must be between 1 and 31";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getFormData = (id: string): Bill => ({
        id,
        ...formData,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const id = editBillId || Date.now().toString();
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing ? `${BASE_URL}/${id}` : BASE_URL;
        const newBill = getFormData(id);

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBill),
            });
            if (!response.ok) throw new Error("Failed to save bill");

            const savedBill = await response.json();
            setBills((prev) =>
                isEditing ? prev.map((b) => (b.id === id ? savedBill : b)) : [...prev, savedBill]
            );
            setFormData(emptyBill);
            setEditBillId(null);
        } catch (err) {
            console.error("Error saving bill:", err);
        }
    };

    const startEditing = (bill: Bill) => {
        setFormData(bill);
        setEditBillId(bill.id);
    };

    const deleteBill = async (bill: Bill) => {
        try {
            const response = await fetch(`${BASE_URL}/${bill.id}`, { method: "DELETE" });
            if (response.status === 204) {
                setBills((prev) => prev.filter((b) => b.id !== bill.id));
            } else {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            console.error("Error deleting bill:", err);
        }
    };

    return {
        formData,
        setFormData,
        handleInputChange,
        handleSubmit,
        errors,
        bills,
        startEditing,
        deleteBill,
        isEditing,
    };
}
