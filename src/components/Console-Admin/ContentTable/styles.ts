import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  buttons: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    height: 50,
    margin: '4px 0'
  },
  table: {
    minWidth: 650,
    marginBottom: 51
  },
  tableHead: {
    height: 42,
    backgroundColor: '#D1E2F4',
    textTransform: 'uppercase'
  },
  tableHeadCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0063AF',
    padding: '0 20px'
  },
  tableBodyRows: {
    '&:nth-of-type(even)': {
      backgroundColor: '#FAF9F9'
    }
  },
  loadingSpinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recordName: {
    width: 'max-content',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  dialog: {
    width: 800
  },
  tableBodyCell: {
    padding: '0 16px'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '50% 50%'
  },
  card: {
    padding: '5px',
    border: '1px solid #8d8dd52b',
    borderRadius: '10px',
    margin: '5px',
    boxShadow: '0px 0px 1px 0px #d4d6db'
  },
  cardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  chipGlobal: {
    padding: '0 3px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#0063AF',
    background: '#F1F9FF',
    border: '1px solid #8A8AEC24',
    borderRadius: '10px'
  },
  chipHierarchical: {
    padding: '0 3px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#329732',
    background: '#E7F9F1',
    border: '1px solid #D1F7D5',
    borderRadius: '10px'
  },
  markdownWrapper: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    margin: '1em',
    '&:hover': {
      border: '1px solid rgba(0, 0, 0, 0.87)'
    },
    '&:focus-within': {
      border: '2px solid #1976d2'
    }
  }
}))

export default useStyles
