import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TimerEntriesTable } from "./TimerEntriesTable";

const sampleEntries = [
  {
    text: "First task",
    timestamp: "00:01:23.456",
  },
  {
    text: "Second task",
    timestamp: "00:05:10.200",
  },
  {
    text: "Third task",
    timestamp: "00:12:45.789",
  },
];

describe("TimerEntriesTable", () => {
  const onDeleteEntry = vi.fn();
  const onDeleteEntries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all entries", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const rows = screen.getAllByTestId("timer-entry");
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent("First task");
    expect(rows[1]).toHaveTextContent("Second task");
    expect(rows[2]).toHaveTextContent("Third task");
  });

  it("renders empty state when no entries", () => {
    render(
      <TimerEntriesTable
        entries={[]}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    expect(screen.getByTestId("timer-entries-empty")).toBeInTheDocument();
    expect(screen.queryAllByTestId("timer-entry")).toHaveLength(0);
  });

  it("renders a checkbox for each row", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("does not show delete button when no rows are selected", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    expect(screen.queryByTestId("delete-selected-button")).not.toBeInTheDocument();
  });

  it("shows delete button when a row checkbox is clicked", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);

    expect(screen.getByTestId("delete-selected-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-selected-button")).toHaveTextContent("Delete 1 Entry");
  });

  it("shows correct count for multiple selected rows", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    expect(screen.getByTestId("delete-selected-button")).toHaveTextContent("Delete 2 Entries");
  });

  it("hides delete button when all rows are deselected", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);
    expect(screen.getByTestId("delete-selected-button")).toBeInTheDocument();

    fireEvent.click(checkboxes[0]);
    expect(screen.queryByTestId("delete-selected-button")).not.toBeInTheDocument();
  });

  it("opens confirmation dialog when delete button is clicked", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(screen.getByTestId("delete-selected-button"));

    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    expect(screen.getByTestId("cancel-delete-button")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument();
  });

  it("calls onDeleteEntries with selected indices when confirmed", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    fireEvent.click(screen.getByTestId("delete-selected-button"));
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    expect(onDeleteEntries).toHaveBeenCalledTimes(1);
    const calledWith = onDeleteEntries.mock.calls[0][0] as number[];
    expect(calledWith).toContain(0);
    expect(calledWith).toContain(2);
    expect(calledWith).toHaveLength(2);
  });

  it("does not call onDeleteEntries when cancel is clicked", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByTestId("delete-selected-button"));
    fireEvent.click(screen.getByTestId("cancel-delete-button"));

    expect(onDeleteEntries).not.toHaveBeenCalled();
  });

  it("clears selection after confirmed deletion", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const checkboxes = screen.getAllByTestId("row-checkbox");
    fireEvent.click(checkboxes[0]);

    fireEvent.click(screen.getByTestId("delete-selected-button"));
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    expect(screen.queryByTestId("delete-selected-button")).not.toBeInTheDocument();
  });

  it("applies red background to selected rows", () => {
    render(
      <TimerEntriesTable
        entries={sampleEntries}
        onDeleteEntry={onDeleteEntry}
        onDeleteEntries={onDeleteEntries}
      />,
    );

    const rows = screen.getAllByTestId("timer-entry");
    const checkboxes = screen.getAllByTestId("row-checkbox");

    fireEvent.click(checkboxes[1]);

    expect(rows[1].className).toMatch(/bg-red/);
    expect(rows[0].className).not.toMatch(/bg-red/);
    expect(rows[2].className).not.toMatch(/bg-red/);
  });
});
