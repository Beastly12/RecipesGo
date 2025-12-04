import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { handleSignOut } from "../services/AuthService.mjs";


// ------------------
// Mocks
// ------------------
jest.mock("../services/AuthService.mjs", () => ({
  handleSignOut: jest.fn()
}));

// Simplify antd for test-dom compatibility
jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    Dropdown: ({ children, overlay }) => (
      <div>
        {children}
        <div data-testid="dropdown">{overlay}</div>
      </div>
    ),
    Drawer: ({ open, children }) =>
      open ? <div data-testid="drawer">{children}</div> : null
  };
});


// ------------------
// Helpers
// ------------------
const renderHeader = (props = {}) => {
  const defaultProps = {
    userId: "abc123456789",
    colorTheme: "dark",
    setTheme: jest.fn(),
    userName: "Dafe",
    profilePic: null,
    isSearching: false,
    searchTerm: "",
    setSearchTerm: jest.fn(),
    handleClearSearch: jest.fn(),
    onSearch: jest.fn(),
  };

  return render(
    <MemoryRouter>
      <Header {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

// Needed for debounce
jest.useFakeTimers();


describe("Header - user interactions", () => {

  test("typing into search triggers debounced onSearch", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSearch = jest.fn();

    renderHeader({ onSearch });

    const input = screen.getByPlaceholderText(/search recipes/i);

    await user.type(input, "pizza");

    // Debounce delay = 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onSearch).toHaveBeenCalledWith("pizza");
  });


  test("clear search button calls handleClearSearch", async () => {
    const user = userEvent.setup();
    const clearMock = jest.fn();

    renderHeader({
      searchTerm: "burger",
      handleClearSearch: clearMock
    });

    const clearBtn = screen.getByRole("button");

    await user.click(clearBtn);

    expect(clearMock).toHaveBeenCalled();
  });


  test("theme toggle calls setTheme", async () => {
    const user = userEvent.setup();
    const setTheme = jest.fn();

    renderHeader({ setTheme });

    // first clickable theme icon span
    const toggle = screen.getAllByRole("img")[0].parentElement;

    await user.click(toggle);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });


  test("shows login button if NOT authenticated", () => {
    renderHeader({
      userId: null
    });

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });


  test("shows create recipe link when logged in", () => {
    renderHeader();

    const createBtn = screen.getByRole("link", { name: /create recipe/i });

    expect(createBtn).toHaveAttribute("href", "/createRecipe");
  });


  test("logout click calls handleSignOut", async () => {
    const user = userEvent.setup();

    renderHeader();

    const logoutItem = screen.getByText(/logout/i);

    await user.click(logoutItem);

    expect(handleSignOut).toHaveBeenCalled();
  });


  test("mobile drawer opens when menu button clicked", async () => {
    const user = userEvent.setup();

    renderHeader();

    const menuBtn = screen.getByRole("button", {
      name: ""
    });

    await user.click(menuBtn);

    expect(screen.getByTestId("drawer")).toBeInTheDocument();
  });

});
