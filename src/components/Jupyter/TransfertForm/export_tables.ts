import { ExportTableType } from 'types'

const exportTable: ExportTableType[] = [
  {
    id: 'person',
    table_name: 'Patient',
    table_id: 'person'
  },
  {
    id: 'iris',
    table_name: 'Patient - Données géographiques',
    table_id: 'iris'
  },
  {
    id: 'visit_occurrence',
    table_name: 'Prise en charge',
    table_id: 'visit_occurrence'
  },
  {
    id: 'visit_detail',
    table_name: 'Prise en charge - Passages ',
    table_id: 'visit_detail'
  },
  {
    id: 'condition_occurrence',
    table_name: 'Fait - PMSI - Diagnostics',
    table_id: 'condition_occurrence'
  },
  {
    id: 'procedure_occurrence',
    table_name: 'Fait - PMSI - Actes',
    table_id: 'procedure_occurrence'
  },
  {
    id: 'cost',
    table_name: 'Fait - PMSI - GHM',
    table_id: 'cost'
  },
  {
    id: 'note',
    table_name: 'Fait - Documents cliniques',
    table_id: 'note'
  },
  {
    id: 'measurement',
    table_name: 'Fait - Biologie',
    table_id: 'measurement'
  },
  {
    id: 'drug_exposure_prescription',
    table_name: 'Fait - Médicaments - Prescription',
    table_id: 'drug_exposure_prescription'
  },
  {
    id: 'drug_exposure_administration',
    table_name: 'Fait - Médicaments - Administration',
    table_id: 'drug_exposure_administration'
  },
  {
    id: 'imaging_study',
    table_name: 'Fait - Imagerie - Étude',
    table_id: 'imaging_study'
  },
  {
    id: 'imaging_series',
    table_name: 'Fait - Imagerie - Série',
    table_id: 'imaging_series'
  },
  {
    id: 'care_site',
    table_name: 'Référentiel - Structure hospitalière',
    table_id: 'care_site'
  },
  {
    id: 'fact_relationship',
    table_name: 'Référentiel - Liens entre entités',
    table_id: 'fact_relationship'
  },
  {
    id: 'concept',
    table_name: 'Référentiel - Terminologie - Concept',
    table_id: 'concept'
  },
  {
    id: 'concept_relationship',
    table_name: 'Référentiel - Terminologie - Lien entre concepts',
    table_id: 'concept_relationship'
  },
  {
    id: 'vocabulary',
    table_name: 'Référentiel - Terminologie - Vocabulaire et nomenclature',
    table_id: 'vocabulary'
  }
]

export default exportTable
