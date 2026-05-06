import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }
}))

import api from 'services/api'
import {
  listContentTypes,
  listContents,
  deleteContent,
  getContent,
  createContent,
  updateContent
} from './contentsService'

const get = api.get as ReturnType<typeof vi.fn>
const post = api.post as ReturnType<typeof vi.fn>
const patch = api.patch as ReturnType<typeof vi.fn>
const del = api.delete as ReturnType<typeof vi.fn>

beforeEach(() => {
  get.mockReset()
  post.mockReset()
  patch.mockReset()
  del.mockReset()
})

describe('listContentTypes', () => {
  it('returns data on success', async () => {
    get.mockResolvedValue({ status: 200, data: { Foo: 'foo' } })
    await expect(listContentTypes()).resolves.toEqual({ Foo: 'foo' })
  })

  it('throws on non-200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(listContentTypes()).rejects.toThrow('Error while fetching content types')
  })
})

describe('listContents', () => {
  it('uses the default ordering when none is provided', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1 }] } })
    await listContents()
    expect(get).toHaveBeenCalledWith('/webcontent/contents/?ordering=-created_at')
  })

  it('appends content type filter and custom ordering', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [] } })
    await listContents(['banner', 'note'], 'created_at')
    expect(get).toHaveBeenCalledWith('/webcontent/contents/?ordering=created_at&content_type=banner,note')
  })

  it('throws on non-200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(listContents()).rejects.toThrow('Error while fetching contents')
  })
})

describe('deleteContent', () => {
  it('returns true on 204', async () => {
    del.mockResolvedValue({ status: 204 })
    await expect(deleteContent(1)).resolves.toBe(true)
  })

  it('returns false on other status', async () => {
    del.mockResolvedValue({ status: 500 })
    await expect(deleteContent(1)).resolves.toBe(false)
  })

  it('throws when the request throws', async () => {
    del.mockRejectedValueOnce(new Error('boom'))
    await expect(deleteContent(1)).rejects.toThrow('Error while deleting content')
  })
})

describe('getContent', () => {
  it('returns the content on success', async () => {
    get.mockResolvedValue({ status: 200, data: { id: 1 } })
    await expect(getContent(1)).resolves.toEqual({ id: 1 })
  })

  it('throws on non-200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getContent(1)).rejects.toThrow('Error while fetching content')
  })
})

describe('createContent', () => {
  it('returns the created content on 201', async () => {
    post.mockResolvedValue({ status: 201, data: { id: 7 } })
    await expect(createContent({} as never)).resolves.toEqual({ id: 7 })
  })

  it('throws on non-201', async () => {
    post.mockResolvedValue({ status: 400 })
    await expect(createContent({} as never)).rejects.toThrow('Error while creating content')
  })
})

describe('updateContent', () => {
  it('returns the updated content on 200', async () => {
    patch.mockResolvedValue({ status: 200, data: { id: 7 } })
    await expect(updateContent({} as never, 7)).resolves.toEqual({ id: 7 })
    expect(patch).toHaveBeenCalledWith('/webcontent/contents/7/', {})
  })

  it('throws on non-200', async () => {
    patch.mockResolvedValue({ status: 500 })
    await expect(updateContent({} as never, 7)).rejects.toThrow('Error while updating content')
  })
})
