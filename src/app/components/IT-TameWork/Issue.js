import { useState } from "react";

const IssuePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(
    "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment."
  );

  const activityLogs = [
    {
      user: "Frederick Adams",
      action: "added a comment",
      time: "3h ago",
      comment:
        "Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN’T be like.",
    },
    {
      user: "Carolyn Perkins",
      action: "assigned",
      time: "4h ago",
      details: "Frederick Adams, Joyce Freeman",
    },
    {
      user: "Carolyn Perkins",
      action: "added tags",
      time: "4h ago",
      details: ["Bug", "High priority"],
    },
    {
      user: "Carolyn Perkins",
      action: "added a comment",
      time: "4h ago",
      comment:
        "Saying that Java is nice because it works on all OSes is like saying that anal sex is nice because it works on all genders.",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Left Content */}
      <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {!isEditing ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              API not working
            </h1>
            <p className="text-sm text-gray-500">
              #PD-127 created by{" "}
              <span className="font-medium text-gray-800 dark:text-gray-100">
                Carolyn Perkins
              </span>
            </p>

            <p className="mt-4 text-gray-800 dark:text-gray-300">
              {description}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              API not working
            </h1>
            <textarea
              className="w-full mt-4 p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Done
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <h2 className="mt-8 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Activity
        </h2>
        <ul className="mt-4 space-y-4">
          {activityLogs.map((log, index) => (
            <li
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {log.user}
                </span>{" "}
                {log.action} {log.time}
              </p>
              {log.comment && (
                <p className="mt-2 text-gray-800 dark:text-gray-300">
                  {log.comment}
                </p>
              )}
              {log.details && (
                <p className="mt-2 text-gray-800 dark:text-gray-300">
                  {Array.isArray(log.details)
                    ? log.details.join(", ")
                    : log.details}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Details
        </h2>
        <ul className="mt-4 space-y-2">
          <li className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Status:</span> In Progress
          </li>
          <li className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Sprint:</span> Sprint 2
          </li>
          <li className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Linked tickets:</span> None
          </li>
          <li className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Story Points:</span> 5
          </li>
          <li className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Created on:</span> Jan 22, 2025
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Assignees
        </h3>
        <ul className="mt-4 space-y-2">
          <li className="text-gray-800 dark:text-gray-300">Frederick Adams</li>
          <li className="text-gray-800 dark:text-gray-300">Joyce Freeman</li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Tags
        </h3>
        <ul className="mt-4 flex space-x-2">
          <li className="bg-red-100 text-red-500 px-2 py-1 rounded">Bug</li>
          <li className="bg-yellow-100 text-yellow-500 px-2 py-1 rounded">
            High priority
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IssuePage;
