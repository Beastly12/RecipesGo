import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpForm from "./SignUpForm";

describe("SignUpForm user interactions", () => {
  test("user can fill the form and submit", async () => {
    const user = userEvent.setup();
    const mockSignup = jest.fn();

    render(<SignUpForm onSignup={mockSignup} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "pass12345");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockSignup).toHaveBeenCalledTimes(1);

    expect(mockSignup).toHaveBeenCalledWith(
      "john@example.com",
      "pass12345",
      "John Doe"
    );
  });
});
