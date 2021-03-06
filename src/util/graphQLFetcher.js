import fetch from 'isomorphic-fetch'

//                 new preferred               old                        Rocket.Chat
const ORIGIN_URL = process.env.APP_BASE_URL || process.env.APP_BASEURL || process.env.ROOT_URL

export default function graphQLFetcher(lgJWT, baseURL, origin = ORIGIN_URL) {
  if (!lgJWT) {
    throw new Error('Need lgJWT to set "Authorization:" header')
  }
  if (!baseURL) {
    throw new Error('Need base URL of GraphQL API service')
  }
  if (!origin) {
    throw new Error('Need origin to set the "Origin:" HTTP header')
  }
  return graphQLParams => {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lgJWT}`,
        'Origin': origin,
        'Content-Type': 'application/json',
        'LearnersGuild-Skip-Update-User-Middleware': 1,
      },
      body: JSON.stringify(graphQLParams),
    }

    return fetch(`${baseURL}/graphql`, options)
      .then(resp => {
        if (!resp.ok) {
          return resp.text().then(body => {
            throw new Error(body)
          })
        }
        return resp.json()
      })
      .then(({errors, data}) => {
        if (errors) {
          throw new Error(errors[0].message)
        }
        return data
      })
  }
}
