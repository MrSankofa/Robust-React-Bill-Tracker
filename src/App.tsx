import './App.css'
import {useBills} from "./components/useBills.ts";
import {BillForm} from "./components/BillForm.tsx";
import {BillTable} from "./components/BillTable.tsx";
import {useState} from "react";


function App() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const authToken = localStorage.getItem('authToken');
    const {
        bills,
        formData,
        errors,
        isEditing,
        handleSubmit,
        handleInputChange,
        startEditing,
        deleteBill,
    } = useBills(authToken, { onUnauthorized: () => setShowLoginModal(true) });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Bill Tracker</h1>

            <BillForm
                formData={formData}
                errors={errors}
                isEditing={isEditing}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
            />

            <BillTable
                bills={bills}
                onEdit={startEditing}
                onDelete={deleteBill}
            />
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

        </div>
    );
}

export default App
