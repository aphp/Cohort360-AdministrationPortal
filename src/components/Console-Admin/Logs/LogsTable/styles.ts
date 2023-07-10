import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  jsonDisplay: {
    maxHeight: 100,
    backgroundColor: '#F5F2F1',
    width: '100%',
    overflowY: 'scroll',
    wordWrap: 'break-word',
    padding: 8
  },
  swaggerMethod: {
    padding: '2px 12px',
    color: '#FFF',
    fontWeight: 700,
    borderRadius: 3
  },
  separator: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '#D0D7D8 solid 1px'
  },
  divCentered: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export default useStyles
