import { ResourceType } from 'types'

export type ExportTableType = {
  id: string
  name: string
  label: string
  subtitle?: string
  resourceType: ResourceType
}

const exportTable: ExportTableType[] = [
  {
    id: 'person',
    name: 'Patient',
    label: 'person',
    resourceType: ResourceType.PATIENT
  },
  {
    id: 'iris',
    name: 'Zone géographique',
    label: 'iris',
    resourceType: ResourceType.UNKNOWN
  },
  {
    id: 'visit_occurrence',
    name: 'Prise en charge',
    label: 'visit_occurrence',
    resourceType: ResourceType.UNKNOWN
  },
  {
    id: 'visit_detail',
    name: 'Détail de prise en charge',
    label: 'visit_detail',
    resourceType: ResourceType.UNKNOWN
  },
  {
    id: 'condition_occurrence',
    name: 'Fait - PMSI - Diagnostics',
    label: 'condition_occurrence',
    resourceType: ResourceType.CONDITION
  },
  {
    id: 'procedure_occurrence',
    name: 'Fait - PMSI - Actes',
    label: 'procedure_occurrence',
    resourceType: ResourceType.PROCEDURE
  },
  {
    id: 'cost',
    name: 'Fait - PMSI - GHM',
    label: 'cost',
    resourceType: ResourceType.CLAIM
  },
  {
    id: 'note_legacy',
    name: 'Fait - Documents cliniques',
    label: 'note_legacy',
    resourceType: ResourceType.DOCUMENTS
  },
  {
    id: 'measurement',
    name: 'Fait - Biologie',
    label: 'measurement',
    resourceType: ResourceType.OBSERVATION
  },
  {
    id: 'drug_exposure_prescription',
    name: 'Fait - Médicaments - Prescription',
    label: 'drug_exposure_prescription',
    resourceType: ResourceType.MEDICATION_REQUEST
  },
  {
    id: 'drug_exposure_administration',
    name: 'Fait - Médicaments - Administration',
    label: 'drug_exposure_administration',
    resourceType: ResourceType.MEDICATION_ADMINISTRATION
  },
  {
    id: 'care_site',
    name: 'Structure hospitalière',
    label: 'care_site',
    resourceType: ResourceType.UNKNOWN
  },
  {
    id: 'fact_relationship',
    name: 'Référentiel',
    label: 'fact_relationship',
    resourceType: ResourceType.UNKNOWN
  },
  {
    id: 'imaging_study',
    name: 'Fait - Imagerie - Étude',
    label: 'imaging_study',
    resourceType: ResourceType.IMAGING
  },
  {
    id: 'imaging_series',
    name: 'Fait - Imagerie - Séries',
    label: 'imaging_series',
    resourceType: ResourceType.IMAGING
  }
]

export default exportTable
