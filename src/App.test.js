import { render, screen } from '@testing-library/react';
import App from './App';
import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import { shallow } from "enzyme";




test('Render login', () => {
  render(<App />);
  // const linkElement = screen.getByText(/Up Bank/i);
  // find email input field and add text
  const emailInput = screen.getByLabelText(/Email/i);
  expect(emailInput).toBeInTheDocument();
  // find password input field and add text
  const passwordInput = screen.getByLabelText(/Password/i);
  expect(passwordInput).toBeInTheDocument();
  
});
