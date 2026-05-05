import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/")({
  component: QuizzesIndex,
});

function QuizzesIndex() {
  return (
    <div className="p-4">
      <h2
        className="text-2xl font-semibold"
        data-testid="quizzes-heading"
      >
        Quizzes
      </h2>
      <p
        className="mt-2 text-sm text-muted-foreground"
        data-testid="quizzes-description"
      >
        Drill specific Japanese grammar points until they stick.
      </p>

      <ul
        className="mt-6 flex flex-col gap-2"
        data-testid="quizzes-list"
      >
        <li>
          <Link
            to="/quizzes/giving-and-receiving"
            className={`
              block rounded-md border p-3 transition-colors
              hover:bg-accent
            `}
            data-testid="quizzes-link-giving-and-receiving"
          >
            <p className="font-medium">Giving and Receiving</p>
            <p className="text-sm text-muted-foreground">
              あげる・くれる・もらう and their て-form auxiliary versions.
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
