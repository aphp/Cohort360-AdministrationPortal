import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  dialog: {
    width: 800
  },
  tableBodyRows: {
    '&:nth-of-type(even)': {
      backgroundColor: '#FAF9F9'
    }
  },
  tableBodyCell: {
    padding: '0 16px'
  },
  buttons: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    height: 50,
    margin: '4px 0'
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
  }
}))

export default useStyles
