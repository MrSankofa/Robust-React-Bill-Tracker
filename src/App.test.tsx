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
