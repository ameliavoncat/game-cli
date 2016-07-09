import errorReporter from '../../util/errorReporter'
import graphQLFetcher from '../../util/graphQLFetcher'
import getServiceBaseURL, {GAME} from '../../util/getServiceBaseURL'

export default class LogRetroCommand {
  constructor(lgJWT, notify, formatMessage, formatError) {
    this.runGraphQLQuery = graphQLFetcher(lgJWT, getServiceBaseURL(GAME))
    this.notifyMsg = msg => notify(formatMessage(msg))
    this.notifyError = err => notify(formatError(err))
  }

  invokeResponseAPI(questionNumber, responseParams, projectName) {
    const mutation = {
      query: `
        mutation($response: CLISurveyResponse!, $projectName: String) {
          saveRetrospectiveCLISurveyResponse(response: $response, projectName: $projectName) {
            createdIds
          }
        }
      `,
      variables: {response: {questionNumber, responseParams}, projectName},
    }
    return this.runGraphQLQuery(mutation)
      .then(data => data.saveRetrospectiveCLISurveyResponse)
  }

  invokeSurveyQuestionAPI(questionNumber, projectName) {
    const query = {
      query:
        `query($questionNumber: Int!, $projectName: String) {
          getRetrospectiveSurveyQuestion(questionNumber: $questionNumber, projectName: $projectName) {
            ... on SurveyQuestionInterface {
              id subjectType responseType body
              responseIntructions
            }
            ... on SinglePartSubjectSurveyQuestion {
              subject { id name handle }
              response { value }
            }
            ... on MultiPartSubjectSurveyQuestion {
              subject { id name handle }
              response { value }
            }
          }
        }`,
      variables: {questionNumber, projectName},
    }
    return this.runGraphQLQuery(query)
      .then(data => data.getRetrospectiveSurveyQuestion)
  }

  invokeGetSurveyAPI(projectName) {
    const query = {
      query:
        `query($projectName: String) {
          getRetrospectiveSurvey(projectName: $projectName) {
            questions {
              ... on SurveyQuestionInterface {
                id subjectType responseType body
                responseIntructions
              }
              ... on SinglePartSubjectSurveyQuestion {
                subject { id name handle }
                response { value }
              }
              ... on MultiPartSubjectSurveyQuestion {
                subject { id name handle }
                response { value }
              }
            }
          }
        }`,
      variables: {projectName}
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

  completedStatusMessage() {
    return [
      'Nice work! You\'ve completed 100% of the reflections.',
      '',
      'To edit any of your reflections, just log it again before the end of the cycle.',
    ].join('\n')
  }

  incompleteStatusMessage(responseCount, questionCount) {
    return [
      `You have logged ${responseCount}/${questionCount} of your reflections for this retrospective.` +
      '  Run `/log -r.` at any time to check your progress.',
      '',
      '  To log a reflection, pick a question using the command:',
      '  `/log -r -q<integer from 1-12>`',
      '',
      '  For example:',
      '  `/log -r -q3` => show question 3 (of 12)',
      '',
      '  Then follow the instructions specified in the question to answer.',
    ].join('\n')
  }

  statusMessage(survey) {
    const responseCount = survey.questions.filter(q => q.response).length
    return responseCount === survey.questions.length ?
      this.completedStatusMessage() :
      this.incompleteStatusMessage(responseCount, survey.questions.length)
  }

  printSurvey(projectName) {
    return this.invokeGetSurveyAPI(projectName)
      .then(survey => {
        const questionList = survey.questions.map(
          (question, i) => this.formatQuestion(question, {questionNumber: i + 1, skipInstructions: true})
        ).join('\n')

        return this.notifyMsg([
          this.statusMessage(survey),
          '',
          questionList
        ].join('\n'))
      })
      .catch(err => {
        errorReporter.captureException(err)
        this.notifyError(`${err.message || err}`)
      })
  }

  printSurveyQuestion(questionNumber, projectName) {
    return this.invokeSurveyQuestionAPI(questionNumber, projectName)
      .then(question => this.notifyMsg(this.formatQuestion(question, {questionNumber})))
      .catch(err => {
        errorReporter.captureException(err)
        this.notifyError(`${err.message || err}`)
      })
  }

  logReflection(questionNumber, responseParams, projectName) {
    return this.invokeResponseAPI(questionNumber, responseParams, projectName)
      .then(() => this.notifyMsg(`Reflection logged for question ${questionNumber}`))
      .catch(err => {
        errorReporter.captureException(err)
        this.notifyError(err.message || err)
      })
  }
}
