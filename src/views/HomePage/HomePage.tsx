import React from 'react'
import { Typography, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const HomePage = () => {

  const history = useHistory()

  return (
    <div>
      <Typography variant='h1'>Bienvenue sur le site de l'eds</Typography>
      <Button onClick={() => (history.push('/users'))}>cliquer ici</Button>
    </div>
  )
}

export default HomePage