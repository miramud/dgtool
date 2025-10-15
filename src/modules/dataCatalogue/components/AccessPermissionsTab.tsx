"use client";

interface AccessPermissionsTabProps {
  dataset: any;
}

export default function AccessPermissionsTab({ dataset }: AccessPermissionsTabProps) {
  // Use dataset information to show access details
  const accessInfo = [
    {
      category: "Data Owner:",
      items: [dataset?.created_by ? `${dataset.created_by.first_name} ${dataset.created_by.last_name}` : "Unknown"]
    },
    {
      category: "Created By:",
      items: [dataset?.created_by ? `${dataset.created_by.first_name} ${dataset.created_by.last_name} (${dataset.created_by.email})` : "Unknown"]
    },
    {
      category: "Business Domain:",
      items: [dataset?.business_domain || "Unknown"]
    },
    {
      category: "Sensitivity Level:",
      items: [dataset?.sensitivity || "Unknown"]
    },
    // {
    //   category: "Client Access:",
    //   items: [dataset?.client ? "Restricted to client" : "General access"]
    // },
    {
      category: "Last Updated By:",
      items: [dataset?.updated_by ? `${dataset.updated_by.first_name} ${dataset.updated_by.last_name} (${dataset.updated_by.email})` : "Not updated"]
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