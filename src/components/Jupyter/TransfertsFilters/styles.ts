import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
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
