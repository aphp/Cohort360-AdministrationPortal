import { ExportTableType } from 'types'

const exportTable: ExportTableType[] = [
  {
    id: 'person',
    table_name: 'Patient',
    table_id: 'person',
    nominative: false
  },
  {
    id: 'observation',
    table_name: 'Patient - Données démographiques',
    table_id: 'observation',
    nominative: true
  },
  {
    id: 'iris',
    table_name: 'Patient - Données géographiques',
    table_id: 'iris',
    nominative: false
  },
  {
    id: 'drug_exposure_prescription',
    table_name: 'Patient - Médicaments - Prescription',
    table_id: 'drug_exposure_prescription',
    nominative: false
  },
  {
    id: 'drug_exposure_administration',
    table_name: 'Patient - Médicaments - Administration',
    table_id: 'drug_exposure_administration',
    nominative: false
  },
  {
    id: 'measurement',
    table_name: 'Patient - Biologie',
    table_id: 'measurement',
    nominative: false
  },
  {
    id: 'visit_occurrence',
    table_name: 'Prise en charge',
    table_id: 'visit_occurrence',
    nominative: false
  },
  {
    id: 'visit_detail',
    table_name: 'Prise en charge - Passages ',
    table_id: 'visit_detail',
    nominative: false
  },
  {
    id: 'cohort_definition',
    table_name: 'Cohorte - Information',
    table_id: 'cohort_definition',
    nominative: false
  },
  {
    id: 'condition_occurrence',
    table_name: 'Fait - PMSI - Diagnostics',
    table_id: 'condition_occurrence',
    nominative: false
  },
  {
    id: 'procedure_occurrence',
    table_name: 'Fait - PMSI - Actes',
    table_id: 'procedure_occurrence',
    nominative: false
  },
  {
    id: 'cost',
    table_name: 'Fait - PMSI - GHM',
    table_id: 'cost',
    nominative: false
  },
  {
    id: 'note',
    table_name: 'Fait - Documents cliniques',
    table_id: 'note',
    nominative: true
  },
  {
    id: 'note_deid',
    table_name: 'Fait - Documents cliniques (pseudo-anonymisés)',
    table_id: 'note_deid',
    nominative: false
  },
  {
    id: 'imaging_study',
    table_name: 'Imagerie - Étude',
    table_id: 'imaging_study',
    nominative: false
  },
  {
    id: 'imaging_series',
    table_name: 'Imagerie - Série',
    table_id: 'imaging_series',
    nominative: false
  },
  {
    id: 'care_site',
    table_name: 'Référentiel - Structure hospitalière',
    table_id: 'care_site',
    nominative: false
  },
  {
    id: 'fact_relationship',
    table_name: 'Référentiel - Liens entre entités',
    table_id: 'fact_relationship',
    nominative: false
  },
  {
    id: 'concept',
    table_name: 'Référentiel - Terminologie - Concept',
    table_id: 'concept',
    nominative: false
  },
  {
    id: 'concept_relationship',
    table_name: 'Référentiel - Terminologie - Lien entre concepts',
    table_id: 'concept_relationship',
    nominative: false
  },
  {
    id: 'vocabulary',
    table_name: 'Référentiel - Terminologie - Vocabulaire et nomenclature',
    table_id: 'vocabulary',
    nominative: false
  }
]

export default exportTable
