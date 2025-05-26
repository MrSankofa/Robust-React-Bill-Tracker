import {createContext, type ReactNode, useContext, useReducer} from "react";
import * as React from "react";

export type Bill = {
    id: string,
    name: string;
    amount: number;
    dueDate: number;
    category: string;
    source: string;
    userId: string;
    isPaid: boolean;
};

export type FormBill = Omit<Bill, 'id' | 'userId' | 'isPaid'> & { id?: string, userId: string};



export type BillState = {
    bills: Bill[],
    monthlyIncome: number;
}

export const BillActionTypes = {
    ADD_BILL: 'ADD_BILL',
    UPDATE_BILL: 'UPDATE_BILL',
    DELETE_BILL: 'DELETE_BILL',
    SET_INCOME: 'SET_INCOME',
    MARK_BILL_PAID: 'MARK_BILL_PAID',
    MARK_BILL_UNPAID: 'MARK_BILL_UNPAID'
} as const;

export type BillActionType = typeof BillActionTypes[keyof typeof BillActionTypes];

export const BILL_ACTIONS = Object.values(BillActionTypes);

type BillAction =
    | { type: typeof BillActionTypes.ADD_BILL; payload: Bill }
    | { type: typeof BillActionTypes.UPDATE_BILL; payload: Bill }
    | { type: typeof BillActionTypes.DELETE_BILL; payload: string }
    | { type: typeof BillActionTypes.SET_INCOME; payload: number }
    | { type: typeof BillActionTypes.MARK_BILL_PAID; payload: string }
    | { type: typeof BillActionTypes.MARK_BILL_UNPAID; payload: string };


const initialState: BillState = {
    bills: [],
    monthlyIncome: 0
};

const billReducer = (state: BillState, action: BillAction): BillState => {

    switch (action.type) {
        case BillActionTypes.ADD_BILL:
            return {
                ...state,
                bills: [...state.bills, action.payload]
            };
        case BillActionTypes.UPDATE_BILL:
            return {
                ...state,
                bills: state.bills.map( bill => bill.id === action.payload.id ? action.payload : bill)
            }
        case BillActionTypes.DELETE_BILL:
            return {
                ...state,
                bills: state.bills.filter( bill => bill.id !== action.payload)
            };
        case BillActionTypes.SET_INCOME:
            return {
                ...state,
                monthlyIncome: action.payload
            };

        case BillActionTypes.MARK_BILL_PAID:
            return {
                ...state,
                bills: state.bills.map(bill =>
                  bill.id === action.payload ? { ...bill, isPaid: true } : bill
                )
            };
        case BillActionTypes.MARK_BILL_UNPAID:
            return {
                ...state,
                bills: state.bills.map(bill =>
                    bill.id === action.payload ? { ...bill, isPaid: false } : bill
                )
            };
        default:
            void (action satisfies never); // cool way to match sure action is never missed in the code in the cases
            return state;
    }
}

const BillContext = createContext<{
    state: BillState;
    dispatch: React.Dispatch<BillAction>;
} | undefined >( undefined);

export const BillProvider = ({ children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(billReducer, initialState);


    return (
        <BillContext.Provider value={{ state, dispatch}}>
            {children}
        </BillContext.Provider>
    )
}

export const useBills = () => {
    const context = useContext(BillContext);

    if( context === undefined) {
        throw new Error("useBills must be used within a BillProvider");
    }

    return context;
}


