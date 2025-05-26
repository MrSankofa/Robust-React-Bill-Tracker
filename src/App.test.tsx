import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

function addBill({
                     name,
                     amount = 100,
                     dueDate = 15,
                     category = 'Utilities',
                     source = 'Chase',
                 }: {
    name: string;
    amount?: number;
    dueDate?: number;
    category?: string;
    source?: string;
}) {
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. DTE/i), {
        target: { value: name },
    });
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), {
        target: { value: amount },
    });
    fireEvent.change(screen.getByPlaceholderText(/15/i), {
        target: { value: dueDate },
    });
    fireEvent.change(screen.getByPlaceholderText(/Unnecessary/i), {
        target: { value: category },
    });
    fireEvent.change(screen.getByPlaceholderText(/chase/i), {
        target: { value: source },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
}


test('updates the correct bill when editing', () => {
    render(<App />);

    // Add two bills
    addBill({ name: 'Bill One' });
    addBill({ name: 'Bill Two' });

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });

    // Edit second bill
    fireEvent.click(editButtons[1]);

    // Change name
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. DTE/i), {
        target: { value: 'Updated Bill Two' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    // Grab all <td> elements that represent bill names (first column)
    const billNames = screen
        .getAllByRole('cell')
        .filter((_, index) => index % 7 === 0) // name is every 7th cell in the table row
        .map(cell => cell.textContent?.trim());

// Now assert exactly what's in the table
    expect(billNames).toContain('Bill One');
    expect(billNames).toContain('Updated Bill Two');
    expect(billNames).not.toContain('Bill Two');

});

test('editing a second bill before submitting the first only updates the last one clicked', () => {
    render(<App />);

    // Add two bills
    addBill({ name: 'Bill A' });
    addBill({ name: 'Bill B' });

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });

    // Start editing A, then switch to editing B
    fireEvent.click(editButtons[0]);
    fireEvent.click(editButtons[1]);

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. DTE/i), {
        target: { value: 'Updated Bill B' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    // Grab all <td> elements that represent bill names (first column)
    const billNames = screen
        .getAllByRole('cell')
        .filter((_, index) => index % 7 === 0) // name is every 7th cell in the table row
        .map(cell => cell.textContent?.trim());

    expect(billNames).toContain('Bill A');
    expect(billNames).toContain('Updated Bill B');
    expect(billNames).not.toContain('Bill B');

});

test('deletes the correct bill when deleting', () => {
    render(<App />);

    // Add two bills
    addBill({ name: 'Bill One' });
    addBill({ name: 'Bill Two' });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });

    // Grab all <td> elements that represent bill names (first column)
    const billNames = screen
        .getAllByRole('cell')
        .filter((_, index) => index % 7 === 0) // name is every 7th cell in the table row
        .map(cell => cell.textContent?.trim());

    expect(billNames).toHaveLength(2);

    // delete first bill
    fireEvent.click(deleteButtons[0]);

    const updateBillNames = screen
        .getAllByRole('cell')
        .filter((_, index) => index % 7 === 0) // name is every 7th cell in the table row
        .map(cell => cell.textContent?.trim());

    expect(updateBillNames).toHaveLength(1);

    expect(billNames).toContain('Bill Two');
    expect(billNames).not.toContain('Bill One');



})
