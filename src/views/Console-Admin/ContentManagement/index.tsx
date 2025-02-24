/* eslint-disable react/react-in-jsx-scope */
import { CircularProgress, Grid, Tab, Tabs, Typography } from '@mui/material'
import useStyles from './styles'
import { useEffect, useState } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import ContentManagementTable from 'components/Console-Admin/ContentTable'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'
import { listContentTypes } from 'services/Console-Admin/contentsService'

const ContentManagement = () => {
  const { classes } = useStyles()
  const [selectedTab, setSelectedTab] = useState('0')
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [contentTypes, setContentTypes] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights()

        setUserRights(getUserRightsResponse)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
        setLoading(false)
      }
    }

    const _getContentTypes = async () => {
      try {
        const contentTypesResp = await listContentTypes()
        setContentTypes(contentTypesResp)
      } catch (error) {
        console.error('Erreur lors de la récupération des types de contenu', error)
      }
    }

    _getUserRights()
    _getContentTypes()
    }, []) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        <Grid container item xs={12} sm={10}>
          <Grid container className={classes.titleContainer}>
            <Typography variant="h1" align="center" className={classes.title}>
              Gestion des contenus
            </Typography>
            <Tabs
              value={selectedTab}
              onChange={(event, newValue) => setSelectedTab(newValue)}
              centered
              className={classes.tabs}
            >
              <Tab label="Actualités" value="0" />
              <Tab label="Messages" value="1" />
            </Tabs>
          </Grid>
          <Grid container item>
            {loading ? (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            ) : (
              <TabContext value={selectedTab}>
                <TabPanel value="0" sx={{ width: '100%', padding: '0' }}>
                  <ContentManagementTable
                    userRights={userRights}
                    contentTypes={contentTypes}
                    labels={{
                      contentType: 'actualité',
                      deleteMessage:
                        "Êtes-vous sûr de vouloir supprimer cette actualité ? Elle disparaitra également de la page d'accueil.",
                      contentTypeGender: 'f'
                    }}
                    allowedContentTypes={['RELEASE_NOTE']}
                    pages={['accueil']}
                    withMarkdown
                  />
                </TabPanel>
                <TabPanel value="1" sx={{ width: '100%', padding: '0' }}>
                  <ContentManagementTable
                    userRights={userRights}
                    contentTypes={contentTypes}
                    labels={{
                      contentType: 'message',
                      deleteMessage:
                        "Êtes-vous sûr de vouloir supprimer ce message ? Il disparaitra également de la page d'accueil.",
                      contentTypeGender: 'm'
                    }}
                    allowedContentTypes={['BANNER_INFO', 'BANNER_WARNING', 'BANNER_ERROR']}
                    pages={['accueil']}
                  />
                </TabPanel>
              </TabContext>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ContentManagement
