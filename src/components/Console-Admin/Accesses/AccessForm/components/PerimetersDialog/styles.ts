import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  content: {
    minHeight: 75
  },
  dialog: {
    height: 'calc(100% - 50px)'
  }
}))

export default useStyles
