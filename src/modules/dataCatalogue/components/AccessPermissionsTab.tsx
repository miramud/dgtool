"use client";

export default function AccessPermissionsTab() {
  const accessInfo = [
    {
      category: "View Access:",
      items: ["Production Engineers", "Reservoir Engineers"]
    },
    {
      category: "Edit Access:",
      items: ["Data Steward", "Data Owner"]
    },
    {
      category: "Approval Workflow:",
      items: ["Restricted edits – Requires owner approval"]
    }
  ];

  return (
    <div className="p-4">
      <div className="space-y-6">
        {accessInfo.map((section, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="min-w-[150px] font-medium text-gray-900">
              {section.category}
            </div>
            <div className="flex-1">
              {section.items.length === 1 ? (
                <span className="text-gray-700">{section.items[0]}</span>
              ) : (
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}