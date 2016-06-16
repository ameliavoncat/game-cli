import errorReporter from '../../util/errorReporter'
import graphQLFetcher from '../../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../../util/getServiceBaseURL'

export default class LogRetroCommand {
  constructor(lgJWT, notify, formatMessage, formatError) {
    this.runGraphQLQuery = graphQLFetcher(lgJWT, getServiceBaseURL(GAME))
    this.notifyMsg = msg => notify(formatMessage(msg))
    this.notifyError = err => notify(formatError(err))
  }

  invokeResponseAPI(questionNumber, responseParams) {
    const mutation = {
      query: `
        mutation($response: CLISurveyResponse!) {
          saveRetrospectiveCLISurveyResponse(response: $response) {
            createdIds
          }
        }
      `,
      variables: {response: {questionNumber, responseParams}},
    }
    return this.runGraphQLQuery(mutation)
      .then(data => data.saveRetrospectiveCLISurveyResponse)
  }

  invokeSurveyQuestionAPI(questionNumber) {
    const query = {
      query:
        `query($questionNumber: Int!) {
          getRetrospectiveSurveyQuestion(questionNumber: $questionNumber) {
            ... on SurveyQuestionInterface {
              id subjectType responseType body
              responseIntructions
            }
            ... on SinglePartSubjectSurveyQuestion {
              subject { id name handle }
            }
            ... on MultiPartSubjectSurveyQuestion {
              subject { id name handle }
            }
          }
        }`,
      variables: {questionNumber},
    }
    return this.runGraphQLQuery(query)
      .then(data => data.getRetrospectiveSurveyQuestion)
  }

  invokeGetSurveyAPI() {
    const query = {
      query:
        `query {
          getRetrospectiveSurvey {
            questions {
              ... on SurveyQuestionInterface {
                id subjectType responseType body
                responseIntructions
              }
              ... on SinglePartSubjectSurveyQuestion {
                subject { id name handle }
              }
              ... on MultiPartSubjectSurveyQuestion {
                subject { id name handle }
              }
            }
          }
        }`,
    }
    return this.runGraphQLQuery(query)
      .then(data => data.getRetrospectiveSurvey)
  }

  formatQuestion(question, {questionNumber, skipInstructions}) {
    let questionText = `*Q${questionNumber}*: ${question.body}`
    if (!skipInstructions && question.responseIntructions) {
      questionText = `${questionText}\n\n${question.responseIntructions}`
    }
    return questionText
  }

  printSurvey() {
    return this.invokeGetSurveyAPI()
      .then(survey =>
        this.notifyMsg(survey.questions.map(
          (question, i) => this.formatQuestion(question, {questionNumber: i + 1, skipInstructions: true})
        ).join(`\n`))
      )
      .catch(error => {
        errorReporter.captureException(error)
        this.notifyError(`${error.message || error}`)
      })
  }

  printSurveyQuestion(questionNumber) {
    return this.invokeSurveyQuestionAPI(questionNumber)
      .then(question => this.notifyMsg(this.formatQuestion(question, {questionNumber})))
      .catch(error => {
        errorReporter.captureException(error)
        this.notifyError(`${error.message || error}`)
      })
  }

  logReflection(questionNumber, responseParams) {
    return this.invokeResponseAPI(questionNumber, responseParams)
      .then(() => this.notifyMsg(`Reflection logged for question ${questionNumber}`))
      .catch(error => {
        errorReporter.captureException(error)
        this.notifyError(error.message || error)
      })
  }
}
