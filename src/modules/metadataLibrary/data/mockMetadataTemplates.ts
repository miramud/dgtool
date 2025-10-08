import { MetadataTemplate } from '../types/metadataTemplate';

export const mockMetadataTemplates: MetadataTemplate[] = [
  {
    id: '1',
    name: 'Seismic Survey Metadata',
    description: 'Standard metadata template for seismic survey data',
    datasetType: 'Seismic Data',
    fieldsNumber: 6,
    createdBy: 'Jane Doe (Admin)',
    lastModified: 'Aug 15, 2025, 14:20',
    status: 'active',
    fields: [
      {
        id: '1',
        name: 'Survey Name',
        type: 'text',
        required: true,
        sensitive: false
      },
      {
        id: '2',
        name: 'Acquisition Year',
        type: 'date',
        required: true,
        sensitive: false
      },
      {
        id: '3',
        name: 'Basin',
        type: 'dropdown',
        required: true,
        sensitive: false,
        options: ['Gulf of Mexico', 'North Sea', 'Permian Basin']
      },
      {
        id: '4',
        name: 'Contractor Name',
        type: 'text',
        required: false,
        sensitive: true
      },
      {
        id: '5',
        name: 'Processing Status',
        type: 'dropdown',
        required: true,
        sensitive: false,
        options: ['Raw', 'Processed', 'Migrated']
      },
      {
        id: '6',
        name: 'Confidential',
        type: 'boolean',
        required: true,
        sensitive: false
      }
    ]
  },
  {
    id: '2',
    name: 'Log Metadata',
    description: 'Standard metadata template for well log data',
    datasetType: 'Well Logs',
    fieldsNumber: 5,
    createdBy: 'John Smith',
    lastModified: 'Aug 10, 2025, 10:05',
    status: 'active',
    fields: [
      {
        id: '1',
        name: 'Well Name',
        type: 'text',
        required: true,
        sensitive: false
      },
      {
        id: '2',
        name: 'Log Type',
        type: 'dropdown',
        required: true,
        sensitive: false,
        options: ['Gamma Ray', 'Resistivity', 'Neutron', 'Density']
      },
      {
        id: '3',
        name: 'Depth Range',
        type: 'text',
        required: true,
        sensitive: false
      },
      {
        id: '4',
        name: 'Logging Company',
        type: 'text',
        required: false,
        sensitive: true
      },
      {
        id: '5',
        name: 'Quality Check',
        type: 'boolean',
        required: true,
        sensitive: false
      }
    ]
  },
  {
    id: '3',
    name: 'Production Data Metadata',
    description: 'Standard metadata template for production data',
    datasetType: 'Production Data',
    fieldsNumber: 7,
    createdBy: 'Jane Doe (Admin)',
    lastModified: 'Jul 30, 2025, 16:40',
    status: 'active',
    fields: [
      {
        id: '1',
        name: 'Field Name',
        type: 'text',
        required: true,
        sensitive: false
      },
      {
        id: '2',
        name: 'Production Date',
        type: 'date',
        required: true,
        sensitive: false
      },
      {
        id: '3',
        name: 'Oil Rate',
        type: 'number',
        required: true,
        sensitive: false
      },
      {
        id: '4',
        name: 'Gas Rate',
        type: 'number',
        required: true,
        sensitive: false
      },
      {
        id: '5',
        name: 'Water Cut',
        type: 'number',
        required: false,
        sensitive: false
      },
      {
        id: '6',
        name: 'Operator',
        type: 'text',
        required: true,
        sensitive: true
      },
      {
        id: '7',
        name: 'Verified',
        type: 'boolean',
        required: true,
        sensitive: false
      }
    ]
  },
  {
    id: '4',
    name: 'HSE Records Metadata',
    description: 'Standard metadata template for HSE records',
    datasetType: 'HSE Records',
    fieldsNumber: 4,
    createdBy: 'Michael Okafor',
    lastModified: 'Jul 25, 2025, 09:15',
    status: 'inactive',
    fields: [
      {
        id: '1',
        name: 'Incident Type',
        type: 'dropdown',
        required: true,
        sensitive: false,
        options: ['Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time']
      },
      {
        id: '2',
        name: 'Date Reported',
        type: 'date',
        required: true,
        sensitive: false
      },
      {
        id: '3',
        name: 'Location',
        type: 'text',
        required: true,
        sensitive: false
      },
      {
        id: '4',
        name: 'Severity Level',
        type: 'dropdown',
        required: true,
        sensitive: false,
        options: ['Low', 'Medium', 'High', 'Critical']
      }
    ]
  }
];