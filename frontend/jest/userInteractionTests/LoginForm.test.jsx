import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm user interactions", () => {
  test("allows the user to type email + password and submit", async () => {
    const user = userEvent.setup();
    const mockLogin = jest.fn();

    render(<LoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "superSecret123");

    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);

    expect(mockLogin).toHaveBeenCalledWith(
      "test@example.com",
      "superSecret123"
    );
  });
});
