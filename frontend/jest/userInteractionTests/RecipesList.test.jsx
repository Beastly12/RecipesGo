import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RecipesList from "./RecipesList";

// Mock skeleton component so tests stay stable
jest.mock("./RecipeCardSkeleton", () => () =>
  <div data-testid="skeleton">Loading...</div>
);

const mockRecipes = [
  {
    key: "1",
    title: "Chicken Alfredo",
    img: "test.jpg",
    author: "John",
    likes: 10
  },
  {
    key: "2",
    title: "Beef Tacos",
    img: "test2.jpg",
    author: "Maria",
    likes: 21
  }
];

describe("RecipesList user interactions", () => {

  test("shows skeletons when loading", () => {
    render(
      <RecipesList
        recipes={[]}
        loading={true}
        hasmore={false}
        handlePagination={jest.fn()}
      />
    );

    expect(screen.getAllByTestId("skeleton")).toHaveLength(4);
  });


  test("renders recipes", () => {
    render(
      <MemoryRouter>
        <RecipesList
          recipes={mockRecipes}
          loading={false}
          hasmore={false}
          handlePagination={jest.fn()}
        />
      </MemoryRouter>
    );

    // Both recipe titles appear
    expect(screen.getByText("Chicken Alfredo")).toBeInTheDocument();
    expect(screen.getByText("Beef Tacos")).toBeInTheDocument();
  });


  test("links navigate to recipe pages", () => {
    render(
      <MemoryRouter>
        <RecipesList
          recipes={mockRecipes}
          loading={false}
          hasmore={false}
          handlePagination={jest.fn()}
        />
      </MemoryRouter>
    );

    const links = screen.getAllByRole("link");

    // Check first recipe link
    expect(links[0]).toHaveAttribute("href", "/recipe/1");

    // Check second recipe link
    expect(links[1]).toHaveAttribute("href", "/recipe/2");
  });


  test("clicking Load More triggers pagination handler", async () => {
    const user = userEvent.setup();
    const mockPagination = jest.fn();

    render(
      <MemoryRouter>
        <RecipesList
          recipes={mockRecipes}
          loading={false}
          hasmore={true}
          handlePagination={mockPagination}
        />
      </MemoryRouter>
    );

    const loadMoreBtn = screen.getByRole("button", {
      name: /load more/i
    });

    await user.click(loadMoreBtn);

    expect(mockPagination).toHaveBeenCalledTimes(1);
  });


  test("shows empty state when no recipes", () => {
    render(
      <RecipesList
        recipes={[]}
        loading={false}
        hasmore={false}
        handlePagination={jest.fn()}
      />
    );

    expect(
      screen.getByText(/no recipes/i)
    ).toBeInTheDocument();
  });

});
