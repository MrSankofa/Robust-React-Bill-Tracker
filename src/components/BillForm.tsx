import type {Bill} from "./useBills.ts";


type BillFormProps = {
    formData: Omit<Bill, "id" | "userId">;
    errors: Record<string, string>;
    isEditing: boolean;
    onChange: (field: string, value: string | number) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
};

export const BillForm: React.FC<BillFormProps> = ({
                                                      formData,
                                                      errors,
                                                      isEditing,
                                                      onChange,
                                                      onSubmit
                                                  }) => {
    return (
        <form onSubmit={onSubmit} className="p-4 space-y-3 max-w-md mx-auto">
            <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Bill" : "Add Bill"}
            </h2>

            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    value={formData.name}
                    placeholder="e.g. DTE"
                    onChange={(e) => onChange("name", e.target.value)}
                    className={`w-full border p-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    value={formData.amount || ""}
                    placeholder="0.00"
                    onChange={(e) => onChange("amount", parseFloat(e.target.value))}
                    className={`w-full border p-2 ${errors.amount ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>

            <div>
                <label htmlFor="dueDate">Due Date</label>
                <input
                    id="dueDate"
                    type="number"
                    value={formData.dueDate || ""}
                    placeholder="15"
                    onChange={(e) => onChange("dueDate", parseFloat(e.target.value))}
                    className={`w-full border p-2 ${errors.dueDate ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
            </div>

            <div>
                <label htmlFor="category">Category</label>
                <input
                    id="category"
                    value={formData.category}
                    placeholder="e.g. Utilities"
                    onChange={(e) => onChange("category", e.target.value)}
                    className={`w-full border p-2 ${errors.category ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="account">Account</label>
                <input
                    id="account"
                    value={formData.account}
                    placeholder="e.g. Chase"
                    onChange={(e) => onChange("account", e.target.value)}
                    className={`w-full border p-2 ${errors.account ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.account && <p className="text-red-500 text-sm">{errors.account}</p>}
            </div>

            <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
                {isEditing ? "Update Bill" : "Add Bill"}
            </button>
        </form>
    );
};
