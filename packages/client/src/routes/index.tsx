import { createFileRoute } from "@tanstack/react-router";

import { Timer } from "@/components/Timer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div
      className={`
        bg-white p-2 text-black
        dark:bg-gray-800 dark:text-white
      `}
    >
      <h3 className="text-3xl font-bold">Welcome Home!</h3>
      <div className="mt-8">
        <Timer />
      </div>
    </div>
  );
}
