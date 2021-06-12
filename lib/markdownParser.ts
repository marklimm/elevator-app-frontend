import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

import { Post } from 'lib/types/Post'

//  this function removes the `.md` extension from the end of a markdown file name
const removeMdExtension = (mdFileName) => mdFileName.replace(/\.md$/, '')

/**
 * This function returns the file names for all of the posts (to be used by getStaticPaths()).  It excludes the `.md` extension
 * @param directory
 * @returns
 */
export const getAllMarkdownFileIds = (
  directory = ''
): { params: { id: string } }[] => {
  const fileNames = fs.readdirSync(directory)

  return fileNames.map((fileName) => {
    return {
      params: {
        id: removeMdExtension(fileName),
      },
    }
  })
}

/**
 * This function returns the "front matter" for an individual post
 * @param directory The directory containing the markdown file
 * @param mdFileName The markdown file that we want to retrieve the front-matter from
 * @returns
 */
const getFrontMatterFromMarkdownFile = (directory = '', mdFileName = '') => {
  // Read markdown file as string
  const fullPath = path.join(directory, mdFileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  return matter(fileContents)
}

/**
 * This function returns the content of an individual post, converted from markdown into html
 * @param frontMatterContent
 * @returns
 */
const getMarkdownContent = async (frontMatterContent = '') => {
  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(frontMatterContent)
  return processedContent.toString()
}

/* 
This function returns the "front matter" data and content from an individual markdown file
*/
export const getMarkdownFileData = async (
  directory = '',
  mdFileName = ''
): Promise<Post> => {
  const frontMatter = getFrontMatterFromMarkdownFile(directory, mdFileName)

  const contentHtml = await getMarkdownContent(frontMatter.content)

  // Combine the data with the id
  return {
    id: removeMdExtension(mdFileName),
    date: '',
    title: '',
    ...frontMatter.data,
    contentHtml,
  }
}

/* 
This function returns the data from all of the markdown files in the specified directory, sorted by timestamp
 */
export const getSortedMarkdownFiles = async (
  directory = ''
): Promise<Post[]> => {
  const directoryFullPath = path.join(process.cwd(), directory)

  // Get the markdown file names within `directoryFullPath`
  const mdFileNames = fs.readdirSync(directoryFullPath)

  const parsedMDFilesPromises = mdFileNames.map(
    async (mdFileName): Promise<Post> => {
      const fileData = await getMarkdownFileData(directory, mdFileName)

      // Combine the data with the id
      return {
        id: removeMdExtension(mdFileName),
        ...fileData,
      }
    }
  )

  const markdownPostsData = await Promise.all(parsedMDFilesPromises)

  const sortedPosts = markdownPostsData.sort((a: Post, b: Post) => {
    if (!!a.date && !!b.date) {
      return a.date < b.date ? 1 : -1
    }

    if (!!a.title && !!b.title) {
      return a.title < b.title ? 1 : -1
    }

    return a.id < b.id ? 1 : -1
  })

  return sortedPosts
}
