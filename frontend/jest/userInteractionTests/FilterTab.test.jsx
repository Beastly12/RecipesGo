import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterTab from "./FilterTab";

const filterDataMock = [
  { key: 0, title: "All" },
  { key: 1, title: "Breakfast" },
  { key: 2, title: "Lunch" },
  { key: 3, title: "Dinner" },
];

describe("FilterTab - User Interactions", () => {

  test("renders all filter tabs", () => {
    render(<FilterTab filterData={filterDataMock} onTabClick={jest.fn()} />);

    filterDataMock.forEach(tab => {
      expect(
        screen.getByRole("button", { name: tab.title })
      ).toBeInTheDocument();
    });
  });


  test("first tab is active by default", () => {
    render(<FilterTab filterData={filterDataMock} onTabClick={jest.fn()} />);

    const firstTab = screen.getByRole("button", { name: "All" });

    expect(firstTab).toHaveClass("bg-[#ff6b6b]");
  });


  test("clicking a tab calls onTabClick with correct title", async () => {
    const user = userEvent.setup();
    const onTabClick = jest.fn();

    render(<FilterTab filterData={filterDataMock} onTabClick={onTabClick} />);

    const lunchTab = screen.getByRole("button", { name: "Lunch" });

    await user.click(lunchTab);

    expect(onTabClick).toHaveBeenCalledTimes(1);
    expect(onTabClick).toHaveBeenCalledWith("Lunch");
  });


  test("clicked tab becomes active", async () => {
    const user = userEvent.setup();

    render(<FilterTab filterData={filterDataMock} onTabClick={jest.fn()} />);

    const lunchTab = screen.getByRole("button", { name: "Lunch" });
    const allTab = screen.getByRole("button", { name: "All" });

    // Click Lunch
    await user.click(lunchTab);

    // Active class swaps
    expect(lunchTab).toHaveClass("bg-[#ff6b6b]");
    expect(allTab).not.toHaveClass("bg-[#ff6b6b]");
  });


  test("active style only applies to clicked tab", async () => {
    const user = userEvent.setup();

    render(<FilterTab filterData={filterDataMock} onTabClick={jest.fn()} />);

    const dinnerTab = screen.getByRole("button", { name: "Dinner" });

    await user.click(dinnerTab);

    filterDataMock.forEach(tab => {
      const btn = screen.getByRole("button", { name: tab.title });

      if (tab.title === "Dinner") {
        expect(btn).toHaveClass("bg-[#ff6b6b]");
      } else {
        expect(btn).not.toHaveClass("bg-[#ff6b6b]");
      }
    });
  });

});
