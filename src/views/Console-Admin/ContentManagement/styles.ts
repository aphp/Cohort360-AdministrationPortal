import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  titleContainer: {
    borderBottom: '1px solid #D0D7D8',
    marginBottom: 20
  },
  title: {
    width: '100%',
    paddingTop: 80
  },
  tabs: {},
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}))

export default useStyles
