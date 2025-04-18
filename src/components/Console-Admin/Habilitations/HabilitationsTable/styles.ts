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
  }
}))

export default useStyles
