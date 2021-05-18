import React, { useState, useEffect } from 'react'
import { CircularProgress, Grid } from '@material-ui/core'

import { getRoles } from 'services/Console-Admin/rolesService'

const Roles:React.FC = () => {

   const [loading, setLoading] = useState(false)

   useEffect(() => {
      setLoading(true)
      getRoles().then((rolesResp:any) => {
         console.log(`rolesResp`, rolesResp)
      }).then(() => (setLoading(false)))
   },[])

   return (
      <Grid>
         {loading ? (
            <CircularProgress />
         ) : (
            <div>en cours de construction</div>
         )}
      </Grid>
   )
}

export default Roles