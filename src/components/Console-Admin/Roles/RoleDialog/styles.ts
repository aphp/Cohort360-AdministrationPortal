import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  dialog: {
    width: 800
  },
  title: {
    fontSize: 18,
    fontFamily: "'Montserrat', sans-serif",
    color: '#0063AF',
    textTransform: 'none',
    lineHeight: 2
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
  }
}))

export default useStyles
