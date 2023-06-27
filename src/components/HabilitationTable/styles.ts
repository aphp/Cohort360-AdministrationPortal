import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  table: {
    minWidth: 650
  },
  tableHead: {
    height: 42,
    backgroundColor: '#D1E2F4',
    textTransform: 'uppercase'
  },
  loadingSpinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  pagination: {
    margin: '10px 0',
    float: 'right',
    '& button': {
      backgroundColor: '#fff',
      color: '#5BC5F2'
    },
    '& .MuiPaginationItem-page.Mui-selected': {
      color: '#0063AF',
      backgroundColor: '#FFF'
    }
  }
}))

export default useStyles
