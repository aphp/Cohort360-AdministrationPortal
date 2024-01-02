import { ExportTableType } from 'types'

const exportTable: ExportTableType[] = [
  {
    id: 'person',
    name: 'Patient',
    label: 'person',
    resourceType: 'Patient'
  },
  {
    id: 'iris',
    name: 'Patient - Données géographiques',
    label: 'iris',
    resourceType: 'Patient'
  },
  {
    id: 'visit_occurrence',
    name: 'Prise en charge',
    label: 'visit_occurrence',
    resourceType: ''
  },
  {
    id: 'visit_detail',
    name: 'Prise en charge - Passages ',
    label: 'visit_detail',
    resourceType: ''
  },
  {
    id: 'condition_occurrence',
    name: 'Fait - PMSI - Diagnostics',
    label: 'condition_occurrence',
    resourceType: 'Condition'
  },
  {
    id: 'procedure_occurrence',
    name: 'Fait - PMSI - Actes',
    label: 'procedure_occurrence',
    resourceType: 'Procedure'
  },
  {
    id: 'cost',
    name: 'Fait - PMSI - GHM',
    label: 'cost',
    resourceType: 'Claim'
  },
  {
    id: 'note',
    name: 'Fait - Documents cliniques',
    label: 'note',
    resourceType: 'DocumentReference'
  },
  {
    id: 'drug_exposure_prescription',
    name: 'Fait - Médicaments - Prescription',
    label: 'drug_exposure_prescription',
    resourceType: 'MedicationRequest'
  },
  {
    id: 'drug_exposure_administration',
    name: 'Fait - Médicaments - Administration',
    label: 'drug_exposure_administration',
    resourceType: 'MedicationAdministration'
  },
  {
    id: 'imaging_study',
    name: 'Fait - Imagerie - Étude',
    label: 'imaging_study',
    resourceType: 'ImagingStudies'
  },
  {
    id: 'imaging_series',
    name: 'Fait - Imagerie - Série',
    label: 'imaging_series',
    resourceType: 'ImagingStudies'
  },
  {
    id: 'care_site',
    name: 'Référentiel - Structure hospitalière',
    label: 'care_site',
    resourceType: ''
  },
  {
    id: 'care_site',
    name: 'Référentiel - Liens entre entités',
    label: 'fact_relationship',
    resourceType: ''
  },
  {
    id: 'concept',
    name: 'Référentiel - Terminologie - Concept',
    label: 'concept',
    resourceType: 'CodableConcept'
  },
  {
    id: 'concept_relationship',
    name: 'Référentiel - Terminologie - Lien entre concepts',
    label: 'concept_relationship',
    resourceType: 'CodableConcept'
  },
  {
    id: 'vocabulary',
    name: 'Référentiel - Terminologie - Vocabulaire et nomenclature',
    label: 'vocabulary',
    resourceType: 'ValueSet'
  }
]

export default exportTable
