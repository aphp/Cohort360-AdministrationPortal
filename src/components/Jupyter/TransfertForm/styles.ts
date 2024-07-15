import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  autocomplete: {
    margin: '1em',
    backgroundColor: 'white'
  },
  accordionContent: {
    padding: '4px 22px 16px 32px'
  },
  checkbox: {
    padding: 0
  },
  validateButton: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    '&:hover': {
      backgroundColor: '#499cbf'
    },
    marginBottom: '4px 0'
  },
  list: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 4,
    maxHeight: 300,
    minHeight: 200,
    overflow: 'auto'
  },
  infoIcon: {
    height: 20,
    margin: '0 5px -5px 0'
  },
  radioGroup: {
    justifyContent: 'space-evenly',
    width: '100%'
  },
  selectAll: {
    display: 'flex',
    gap: '12px',
    margin: 0,
    '& span': {
      fontWeight: 800
    }
  },
  selectedTable: {
    color: '#0063AF',
    fontWeight: '700',
    lineHeight: 1.47
  },
  notSelectedTable: {
    color: '#666',
    fontWeight: '700'
  },
  tableCode: {
    color: '#888',
    fontStyle: 'italic',
    fontWeight: '600',
    padding: '0 5px 0 4px'
  },
  tableSubtitle: {
    color: '#fc1847'
  },
  textBody1: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '700'
  },
  textBody2: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '600'
  },
  expandIcon: {
    cursor: 'pointer',
    height: '24px'
  }
}))

export default useStyles
