import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

it("renders without crashing", () => {
  render(<App />);

  expect(screen.getByLabelText("Choose a pub")).toBeTruthy();
  expect(screen.getByText("Download PDF")).toBeTruthy();
});

it("shows the selected pub in the search box", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Choose a pub"), "Eagle");
  await user.keyboard("{Enter}");

  expect(screen.getByText("Eagle")).toBeTruthy();
  expect(screen.queryByText("Choose a pub...")).toBeNull();
});

it("clears the selected pub", async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByLabelText("Choose a pub");
  await user.type(input, "Eagle");
  await user.keyboard("{Enter}");
  await user.click(input);
  await user.keyboard("{Backspace}");

  expect(screen.getByText("Choose a pub...")).toBeTruthy();
});
