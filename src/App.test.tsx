import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';


test('updates the correct bill when editing', () => {
    render(<App />);

    // Add two bills to start
    fireEvent.change(screen.getByPlaceholderText(/e.g. DTE/i), {
        target: { value: 'Bill One' },
    });
    fireEvent.change(screen.getByPlaceholderText(/0.00/i), {
        target: { value: 100 },
    });
    fireEvent.change(screen.getByPlaceholderText(/15/i), {
        target: { value: 15 },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Unnecessary Bill/i), {
        target: { value: 'Utilities' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. chase/i), {
        target: { value: 'Chase' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // Add second bill
    fireEvent.change(screen.getByPlaceholderText(/e.g. DTE/i), {
        target: { value: 'Bill Two' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));


    // Edit second bill
    const editButtons = screen.getAllByText(/Edit/i);
    fireEvent.click(editButtons[1]);

    // Change name to "Updated Bill Two"
    const nameInput = screen.getByPlaceholderText(/e.g. DTE/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Bill Two' } });

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    // Check only the second bill was updated
    const rows = screen.getAllByRole('row');

    expect(rows[1]).toHaveTextContent('Bill One');
    expect(rows[2]).toHaveTextContent('Updated Bill Two');
});

test("editing a second bill before submitting the first should only update the last one clicked", () => {
    render(<App />);

    // Add Bill A
    fireEvent.change(screen.getByPlaceholderText(/e.g. DTE/i), { target: { value: "Bill A" } });
    fireEvent.change(screen.getByPlaceholderText(/0.00/i), { target: { value: 100 } });
    fireEvent.change(screen.getByPlaceholderText(/15/i), { target: { value: 15 } });
    fireEvent.change(screen.getByPlaceholderText(/Unnecessary/i), { target: { value: "Utilities" } });
    fireEvent.change(screen.getByPlaceholderText(/chase/i), { target: { value: "Chase" } });
    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    // Add Bill B
    fireEvent.change(screen.getByPlaceholderText(/e.g. DTE/i), { target: { value: "Bill B" } });
    fireEvent.click(screen.getByRole("button", { name: /Add/i }));

    const editButtons = screen.getAllByRole("button", { name: /Edit/i });

    // Start editing Bill A
    fireEvent.click(editButtons[0]);

    // IMMEDIATELY switch to editing Bill B
    fireEvent.click(editButtons[1]);

    // Now type "Updated Bill B"
    fireEvent.change(screen.getByPlaceholderText(/e.g. DTE/i), {
        target: { value: "Updated Bill B" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    const rows = screen.getAllByRole("row");
    const text = rows.map((row) => row.textContent);

    // ❌ This will fail because both rows may be updated
    expect(text.some((t) => t?.includes("Updated Bill B"))).toBe(true);
    expect(text.some((t) => t?.includes("Bill A"))).toBe(true); // should NOT be updated
});

