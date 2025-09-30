import React, { useEffect, useState } from "react";

import { formatName } from "../../utils/formatName";
import { useGetPermissions } from "@/modules/userManagement/controllers/rolesController";

const RolePermissionsConfiguration = ({
  selectedPermissions,
  setSelectedPermissions,
}: any) => {
  // const { data: permissionData } = useGetPermissionsManager();
  const { getPermissions, data: permissionData } = useGetPermissions();

  // Load permissions on component mount
  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col gap-2 bg-white w-full p-5 rounded-[10px]'>
      {/* <h3 className='font-bold'>Permissions</h3> */}
      <div className='grid grid-cols-1 md:grid-cols-3'>
        {permissionData?.map((module: any, index) => (
          <RolePermissions
            module={module}
            key={index}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
          />
        ))}
      </div>
    </div>
  );
};

export default RolePermissionsConfiguration;

const RolePermissions = ({
  module,
  selectedPermissions,
  setSelectedPermissions,
}: any) => {
  const [isModuleSelected, setIsModuleSelected] = useState(false);

  const handlePermissionChange = (permission: any) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(
        selectedPermissions.filter((perm: any) => perm !== permission)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleModuleChange = (isChecked: any) => {
    if (isChecked) {
      // Add all permissions of the module to selectedPermissions
      const permissionsToAdd = module.permissions.map((perm: any) => perm.id);
      setSelectedPermissions([...selectedPermissions, ...permissionsToAdd]);
      setIsModuleSelected(true);
    } else {
      // Remove all permissions of the module from selectedPermissions
      const permissionsToRemove = module.permissions.map(
        (perm: any) => perm.id
      );
      setSelectedPermissions(
        selectedPermissions.filter(
          (perm: any) => !permissionsToRemove.includes(perm)
        )
      );
      setIsModuleSelected(false);
    }
  };

  return (
    <div className='w-full '>
      <div className='flex flex-col pb-4'>
        <div>
          <h4 className='text-[14px] font-bold my-4 text-brandGreen flex items-center gap-2'>
            {/* <h4> */}
            <input
              type='checkbox'
              checked={isModuleSelected}
              onChange={(e) => handleModuleChange(e?.target?.checked)}
            />
            {formatName(module.module)}
          </h4>
          <ul className='grid grid-cols-1  gap-4'>
            {module?.permissions?.map((permission: any, index: number) => {
              return (
                <li
                  key={index}
                  className='text-[#272727] flex items-start gap-1'
                >
                  <input
                    // text={permission.name}
                    className='mt-1'
                    type='checkbox'
                    checked={selectedPermissions?.includes(permission?.id)}
                    onChange={() => handlePermissionChange(permission?.id)}
                  />
                  <p>{permission?.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
