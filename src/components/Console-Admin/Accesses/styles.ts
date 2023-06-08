import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  searchButton: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    height: 50,
    margin: '4px 0'
  },
  title: {
    margin: '12px 0'
  }
}))

export default useStyles
