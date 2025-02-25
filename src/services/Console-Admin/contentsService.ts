import api from '../api'
import { WebContent, WebContentCreation, WebContentTypes } from '../../types'

export const listContentTypes = async (): Promise<WebContentTypes> => {
  try {
    const contentTypes = await api.get(`/webcontent/contents/content_types/`)
    if (contentTypes.status !== 200) {
      throw new Error('Error while fetching content types')
    }
    return contentTypes.data ?? undefined
  } catch (error) {
    console.error('Error while fetching content types', error)
    throw new Error('Error while fetching content types')
  }
}

export const listContents = async (contentTypes?: Array<string>, ordering?: string): Promise<WebContent[]> => {
  try {
    const contentTypeFilter = contentTypes ? `&content_type=${contentTypes.join(',')}` : ''
    const orderFilter = ordering ? `ordering=${ordering}` : 'ordering=-created_at'
    const contents = await api.get(`/webcontent/contents/?${orderFilter}${contentTypeFilter}`)

    if (contents.status !== 200) {
      throw new Error('Error while fetching contents')
    }
    return contents.data?.results ?? undefined
  } catch (error) {
    console.error('Error while fetching contents', error)
    throw new Error('Error while fetching contents')
  }
}

export const deleteContent = async (contentId: number): Promise<boolean> => {
  try {
    const deleteContentResp = await api.delete(`/webcontent/contents/${contentId}/`)
    return deleteContentResp.status === 204
  } catch (error) {
    console.error('Error while deleting content', error)
    throw new Error('Error while deleting content')
  }
}

export const getContent = async (contentId: number): Promise<WebContent> => {
  try {
    const contentResp = await api.get(`/webcontent/contents/${contentId}/`)

    if (contentResp.status !== 200) {
      throw new Error('Error while fetching content')
    }
    return contentResp.data ?? undefined
  } catch (error) {
    console.error('Error while fetching content', error)
    throw new Error('Error while fetching content')
  }
}

export const createContent = async (contentData: WebContentCreation): Promise<WebContent> => {
  try {
    const createContentResp = await api.post(`/webcontent/contents/`, contentData)

    if (createContentResp.status !== 201) {
      throw new Error('Error while creating content')
    }

    return createContentResp.data
  } catch (error) {
    console.error('Error while creating content', error)
    throw new Error('Error while creating content')
  }
}

export const updateContent = async (contentData: WebContentCreation, contentId: number): Promise<WebContent> => {
  try {
    const updateContentResp = await api.patch(`/webcontent/contents/${contentId}/`, contentData)

    if (updateContentResp.status !== 200) {
      throw new Error('Error while updating content')
    }
    return updateContentResp.data
  } catch (error) {
    console.error('Error while updating content', error)
    throw new Error('Error while updating content')
  }
}
