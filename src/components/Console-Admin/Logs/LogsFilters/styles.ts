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
  },
  clearDate: {
    padding: 0,
    minWidth: 34,
    width: 34,
    maxWidth: 34
  },
  button: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    height: 30
  }
}))

export default useStyles
