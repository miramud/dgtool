import { DatasetType } from '../types/datasetType';

export const mockDatasetTypes: DatasetType[] = [
  {
    id: '1',
    name: 'Seismic Data',
    description: 'Seismic survey data including raw and processed seismic information',
    createdBy: 'Jane Doe (Admin)',
    lastModified: 'Aug 15, 2025, 14:20',
    status: 'active',
  },
  {
    id: '2',
    name: 'Well Logs',
    description: 'Well logging data including various log types and measurements',
    createdBy: 'John Smith',
    lastModified: 'Aug 10, 2025, 10:05',
    status: 'active',
  },
  {
    id: '3',
    name: 'Production Data',
    description: 'Oil and gas production data including rates and field information',
    createdBy: 'Jane Doe (Admin)',
    lastModified: 'Jul 30, 2025, 16:40',
    status: 'active',
  },
  {
    id: '4',
    name: 'HSE Records',
    description: 'Health, Safety, and Environmental records and incident reports',
    createdBy: 'Michael Okafor',
    lastModified: 'Jul 25, 2025, 09:15',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Geological Data',
    description: 'Geological surveys, rock samples, and subsurface analysis data',
    createdBy: 'Sarah Wilson',
    lastModified: 'Jul 20, 2025, 11:30',
    status: 'active',
  },
  {
    id: '6',
    name: 'Reservoir Data',
    description: 'Reservoir characterization and modeling data',
    createdBy: 'David Chen',
    lastModified: 'Jul 15, 2025, 13:45',
    status: 'active',
  }
];