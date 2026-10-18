import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche le titre Gestion des Employés', () => {
  render(<App />);
  const titre = screen.getByText(/gestion des employés/i);
  expect(titre).toBeInTheDocument();
});

test('affiche le bouton Nouvel Employé', () => {
  render(<App />);
  const bouton = screen.getByText(/nouvel employé/i);
  expect(bouton).toBeInTheDocument();
});