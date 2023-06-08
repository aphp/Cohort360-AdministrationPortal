import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
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
  roleColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoIcon: {
    margin: '0 8px'
  },
  tooltip: {
    maxWidth: 500
  }
}))

export default useStyles
