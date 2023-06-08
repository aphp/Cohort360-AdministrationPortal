import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  title: {
    borderBottom: '1px solid #D0D7D8',
    width: '100%',
    paddingTop: 80,
    paddingBottom: 20,
    marginBottom: 20
  },
  alert: {
    width: '100%'
  }
}))

export default useStyles
