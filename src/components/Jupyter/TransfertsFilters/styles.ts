import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  dialog: {
    width: 500
  },
  datePickers: {
    margin: '1em 0 1em 1em'
  },
  dateLabel: {
    width: 'auto',
    marginRight: 8
  },
  dateError: {
    color: '#f44336'
  }
}))

export default useStyles
