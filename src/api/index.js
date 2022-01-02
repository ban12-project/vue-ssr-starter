import request from '@/util/request'

/**
 * List organization repositories
 */
export function getAllRepos() {
  return request({
    url: '/orgs/ban12-project/repos',
    method: 'get',
  })
}

/**
 * Get a repository
 * @param {object} params
 * @param {string} params.repo
 */
export function getRepo(params) {
  return request({
    url: `/repos/ban12-project/${params.repo}`,
    method: 'get',
  })
}
