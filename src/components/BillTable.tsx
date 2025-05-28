import { type Bill } from "./useBills";
import * as React from "react";

type BillTableProps = {
    bills: Bill[];
    onEdit: (bill: Bill) => void;
    onDelete: (bill: Bill) => Promise<void>;
};

export const BillTable: React.FC<BillTableProps> = ({ bills, onEdit, onDelete }) => {
    if (bills.length === 0) {
        return <p className="text-center mt-4">No bills to display.</p>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Bills</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Amount</th>
                    <th className="border p-2 text-left">Due Date</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">Account</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {bills.map((bill) => (
                    <tr key={bill.id} className="border-b">
                        <td className="border p-2">{bill.name}</td>
                        <td className="border p-2">${bill.amount.toFixed(2)}</td>
                        <td className="border p-2">{bill.dueDate}</td>
                        <td className="border p-2">{bill.category}</td>
                        <td className="border p-2">{bill.account}</td>
                        <td className="border p-2 flex gap-2 justify-center">
                            <button
                                onClick={() => onEdit(bill)}
                                className="bg-yellow-500 px-2 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(bill)}
                                className="bg-red-600 px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
