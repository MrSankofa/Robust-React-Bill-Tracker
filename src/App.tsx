import {useEffect, useState} from "react";
import {useBills} from "./components/useBills.ts";
import {BillForm} from "./components/BillForm.tsx";
import {BillTable} from "./components/BillTable.tsx";
import {LoginModal} from "./components/LoginModal.tsx";


function App() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(
        localStorage.getItem('authToken')
    );

    const {
        bills,
        formData,
        errors,
        isEditing,
        handleSubmit,
        handleInputChange,
        startEditing,
        deleteBill
    } = useBills(authToken, () => setShowLoginModal(true));

    useEffect(() => {
        if (!authToken) {
            setShowLoginModal(true);
        }
    }, [authToken]);


    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setShowLoginModal(false);
    };

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

            {showLoginModal && (
                <LoginModal
                    onSuccess={handleLoginSuccess}
                    onClose={() => setShowLoginModal(false)}
                />
            )}
        </div>
    );
}

export default App;
